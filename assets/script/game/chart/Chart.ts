import { ecs } from "../../../../extensions/oops-framework/assets/libs/ecs/ECS";

/** Chart 模块 */
export class Chart extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // ChartModel!: ChartModelComp;

    /** ---------- 业务层 ---------- */
    // ChartBll!: ChartBllComp;

    /** ---------- 视图层 ---------- */
    // ChartView!: ChartViewComp;

    /** 实始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
    }

    /** 模块资源释放 */
    destroy() {
        // 注: 自定义释放逻辑，视图层实现 ecs.IComp 接口的 ecs 组件需要手动释放
        super.destroy();
    }
}

/** Chart 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsChartSystem extends ecs.System {
    constructor() {
        super();

        // this.add(new ecs.ComblockSystem());
    }
}
