import { ecs } from '../../../../../extensions/oops-framework/assets/libs/ecs/ECS';
import { ChartRTCInfo } from './ChartRTCInfo';

/** 数据层对象 */
@ecs.register('ChartRTCModel')
export class ChartRTCModelComp extends ecs.Comp {
    chartInfo: ChartRTCInfo = null!;
    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        this.chartInfo = null!;
    }
}
