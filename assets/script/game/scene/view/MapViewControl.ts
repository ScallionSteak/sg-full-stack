/*
 * @Author: dgflash
 * @Date: 2021-12-03 17:25:32
 * @LastEditors: luobao
 * @LastEditTime: 2022-06-17 20:15:51
 */
import { Component, EventTouch, game, Node, Prefab, Size, TiledMap, Touch, tween, UITransform, v3, Vec2, Vec3, view, _decorator } from "cc";
import { Logger } from "../../../../../extensions/oops-framework/assets/core/common/log/Logger";
import { Vec3Util } from "../../../../../extensions/oops-framework/assets/core/utils/Vec3Util";

const { ccclass, property } = _decorator;

/** 精度 */
const Accuracy = 0.01;
/** 惯性移动触发间隔时间（毫秒） */
const Inertia_Trigger_Time = 200;
/** 惯性移动触发间隔距离（像素）*/
const Inertia_Trigger_Distance = 50;
/** 拖拽对象移动地图触发范围 */
const Drag_Object_Trigger_Distance = 80;

class Border {
    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;
}

/** 地图拖拽操作 */
@ccclass("MapViewControl")
export class MapViewControl extends Component {
    @property({
        type: Node,
        tooltip: '地图'
    })
    map: Node | null = null;

    @property({
        type: TiledMap,
        tooltip: '地形'
    })
    tiledmap: TiledMap | null = null;

    @property({
        tooltip: '单点触摸容忍误差'
    })
    moveOffset: number = 2;

    @property(Node)
    blinkFocus!: Node;

    @property(Node)
    maskHole!: Node;

    @property(Node)
    mask!: Node;

    /** 操作锁 */
    public locked: boolean = false;
    /** 点击回调事件 */
    public onSingleTouch: Function | null = null;
    /** 镜头跟踪目标 */
    public target: Node | null = null;

    private isMoving: boolean = false;                   // 是否拖动地图标记

    private uitView!: UITransform;                       // 地图容器变换对象
    private uitMap!: UITransform;                        // 地图变换对象

    private dir: Vec3 = new Vec3();

    private center2: Vec2 = new Vec2();
    private center3: Vec3 = new Vec3();

    /** --- 惯性移动计算相关变量 --- */
    private inertia: boolean = false;
    private inertiaTime!: number;
    private inertiaStart!: Vec2;
    private inertiaVector: Vec3 = new Vec3();

    /** --- 拖拽到边缘触发地图移动 --- */
    private isMapMove = false;

    // 触发拖拽移动地图的边界
    private triggerMoveBorder = new Border();

    /** 地图像素宽度 */
    width: number = 0;
    /** 地图像素高度 */
    height: number = 0;

    /** 跟随目标的位置 */
    private follow_position: Vec3 = new Vec3();

    /** 测试强制引导镜头移动 */
    public isInGuide: boolean = false;

    /** 获取屏幕中心对应地图的位置 */
    getCenterPos(): Vec3 {
        return this.uitMap.convertToNodeSpaceAR(this.center3);
    }

    //#region 初始化
    private getSize(): Size {
        return this.uitView.contentSize;
    }

    init(pos: Vec3 | null = null) {
        // this.addEvent();

        this.uitView = this.node.getComponent(UITransform)!;
        this.uitMap = this.map!.getComponent(UITransform)!;

        var mapSize = this.tiledmap.node.getComponent(UITransform)!
        this.width = mapSize.width;
        this.height = mapSize.height;

        Logger.logView(`地图宽${this.width},地图高${this.height}`);

        this.uitMap.setContentSize(this.width, this.height);

        // 辅助计算触摸拖拽移动地图的边界

        let size = this.getSize();

        this.triggerMoveBorder.left = Drag_Object_Trigger_Distance;
        this.triggerMoveBorder.right = size.width - Drag_Object_Trigger_Distance;
        this.triggerMoveBorder.top = size.height - Drag_Object_Trigger_Distance;
        this.triggerMoveBorder.bottom = Drag_Object_Trigger_Distance;

        this.onResize();
    }

    /** 根据传进来的参数在指定位置播放闪烁动画 */
    moveCameraForGuide(pos: Vec3, width: number, height: number) {
        var moveDuration = 1;
        var originX = this.follow_position.x;
        var originY = this.follow_position.y;
        this.isInGuide = true;
        tween(this.map).to(moveDuration, {position: pos}).call(()=> {
            this.maskHole.active = true;
            this.maskHole.getComponent(UITransform).width = width;
            this.maskHole.getComponent(UITransform).height = height;
            this.blinkFocus.active = false;
            // tween(this.blinkFocus).hide().delay(0.5).show().delay(0.5).union().repeat(3).call(()=>{
            //     this.maskHole.active = false;
            //     this.blinkFocus.active = false;
            //     tween(this.map).to(moveDuration, { position: new Vec3(originX, originY, 0) }).call(()=>{
            //         this.isInGuide = false;
            //     }).start();
            // }).start();
            tween(this.blinkFocus).delay(1).call(() => {
                this.maskHole.active = false;
                this.blinkFocus.active = false;
                tween(this.map).to(moveDuration, { position: new Vec3(originX, originY, 0) }).call(() => {
                    this.isInGuide = false;
                }).start();
            }).start();
        }).start();
    }

    /** 获得当前镜头的坐标 */
    getFollowPosition() {
        return this.follow_position;
    }

    /** 根据目标位置设置屏幕位置看到目标是正中心 */
    setMapByTarget(pos: Vec3) {
        this.follow_position.x = -pos.x;
        this.follow_position.y = -pos.y;
        var pos = this.checkPos(this.follow_position);
        this.map!.position = pos;
    }
    //#endregion

    //#region update
    update(dt: number) {
        if (!this.isInGuide) {
            // 跟随目标移动（战斗场景用）
            if (this.target && this.target.isValid) {
                this.follow_position.x = -this.target.position.x;
                this.follow_position.y = -this.target.position.y;
                var pos = this.checkPos(this.follow_position);
                this.map!.position = Vec3Util.lerp(this.map!.position, pos, 0.5);
            }

            // 惯性移动
            if (this.inertia) {
                this.dir.set(this.inertiaVector.lerp(Vec3.ZERO, dt * 3));
                this.dealPos();

                if (this.inertiaVector.equals(Vec3.ZERO, Accuracy)) {
                    this.inertia = false;
                    this.dir.set(Vec3.ZERO);
                    this.inertiaVector.set(Vec3.ZERO);
                }
            }

            // 拖拽对象到边缘移动地图
            if (this.isMapMove) {
                this.dealPos();
            }
        }
    }
    //#endregion

    //#region 事件处理
    private addEvent(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onResize() {
        var size = this.getSize();

        // 辅助计算缩放回弹
        this.center2.set(size.width / 2, size.height / 2);
        this.center3.set(this.center2.x, this.center2.y);
    }

    private onTouchStart(event: EventTouch) {
        if (this.locked) return;

        // 初始化惯性数据
        this.inertia = false;

        let touches: Touch[] = event.getTouches();
        if (touches.length === 1) {
            this.inertiaTime = game.totalTime;
            this.inertiaStart = touches[0].getLocation();
        }
    }

    private onTouchMove(event: EventTouch) {
        if (this.locked) return;

        // 滑动误差避免出现设备太灵明导致逻辑问题
        var d = Vec2.squaredDistance(event.getStartLocation(), event.getLocation());
        if (d <= 25) return;

        let touches: Touch[] = event.getTouches();

        if (touches.length > 1) {

        }
        else if (touches.length === 1) {
            if (this.isMoving || this.canStartMove(touches[0])) {
                this.isMoving = true;
                let delta = touches[0].getDelta();
                delta = delta.multiplyScalar(1 / view.getScaleX());
                this.dir.set(delta.x, delta.y);
                this.dealPos();
            }
        }
    }

    private onTouchEnd(event: EventTouch) {
        if (this.locked) return;
        if (!this.inertiaStart || !this.inertiaVector) return;

        let touches: any[] = event.getTouches();
        if (touches.length <= 1) {
            // 惯性移动
            var inertia = game.totalTime - this.inertiaTime;
            var t = touches[0];
            Vec2.subtract(this.inertiaVector, t.getLocation(), this.inertiaStart);
            var distance = this.inertiaVector.length();

            if (inertia < Inertia_Trigger_Time && distance > Inertia_Trigger_Distance) {               // 间隔200毫秒且拖拽距离大于100触发惯性
                this.inertiaVector = this.inertiaVector.normalize();
                Vec3.multiplyScalar(this.inertiaVector, this.inertiaVector, distance / 5);
                this.inertia = true;
            }

            if (!this.isMoving) {
                if (this.onSingleTouch) {
                    let nodePos = this.getScreenPosToMapPos(event);
                    this.onSingleTouch(nodePos);
                }
            }

            this.reset();
        }
    }

    stop() {
        this.reset();
        this.inertia = false;
    }

    reset() {
        this.dir.set(Vec3.ZERO);
        this.isMoving = false;
        this.isMapMove = false;
    }
    //#endregion

    //#region 算法

    /** 屏幕坐标转地图坐标 */
    getScreenPosToMapPos(event: EventTouch): Vec3 {
        let uil = event.getUILocation();
        let worldPos: Vec3 = v3(uil.x, uil.y);
        let mapPos: Vec3 = this.uitMap.convertToNodeSpaceAR(worldPos);
        return mapPos;
    }

    /** 有些设备单点过于灵敏，单点操作会触发TOUCH_MOVE回调，在这里作误差值判断 */
    private canStartMove(touch: Touch): boolean {
        let startPos = touch.getStartLocation();
        let nowPos = touch.getLocation();
        // 有些设备单点过于灵敏，单点操作会触发TOUCH_MOVE回调，在这里作误差值判断
        return (Math.abs(nowPos.x - startPos.x) > this.moveOffset || Math.abs(nowPos.y - startPos.y) > this.moveOffset);
    }

    /** 计算地图位置 */
    private dealPos(): void {
        // 计算地图目标移动的位置
        let worldPos: Vec3 = this.uitMap.convertToWorldSpaceAR(Vec3.ZERO);
        let nodePos: Vec3 = this.uitView.convertToNodeSpaceAR(worldPos);
        nodePos.x += this.dir.x;
        nodePos.y += this.dir.y;
        this.map.position = this.checkPos(nodePos);
    }

    /** 地图位置验证 */
    private checkPos(nodePos: Vec3) {
        var size = this.getSize();

        // 屏幕宽高的一半
        let horizontalDistance: number = Math.floor(Math.abs((size.width - this.width * this.map!.scale.x) / 2));
        let verticalDistance: number = Math.floor(Math.abs((size.height - this.height * this.map!.scale.y) / 2));

        if (nodePos.x > horizontalDistance) {
            nodePos.x = horizontalDistance;
        }
        else if (nodePos.x < -horizontalDistance) {
            nodePos.x = -horizontalDistance;
        }

        if (nodePos.y > verticalDistance) {
            nodePos.y = verticalDistance;
        }
        else if (nodePos.y < -verticalDistance) {
            nodePos.y = -verticalDistance;
        }

        return nodePos;
    }
    //#endregion
}