import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ICount } from "./Main.controller";
import UI5Event from "sap/ui/base/Event";

type IArguments = {
    id: string
}
type IItemForCount = {
    countId: string
}
/**
 * @namespace ICL.InventoryCount.controller
 */
export default class SingleCount extends BaseController {
    protected arguments: IArguments
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("singleCount").attachMatched(this._initialFunc, this);

    }

    private _initialFunc(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/title', myComponent.i18n('InvCountTitle'));
        countModel.setProperty('/oFlags/headerNavBack', true);
        this.arguments = oEvent.getParameter("arguments") as IArguments;
        console.log(this.arguments)
        this.loadCount(countModel)
    }

    private loadCount(countModel: JSONModel) {
        const selCount = countModel.getProperty('/oMaintain/selCount') as ICount;
        if (!selCount) {
            this.fetchCount(countModel)
        }
        this.fetchItems(countModel)
    }
    private fetchItems(countModel: JSONModel) {
        void fetch("/mockData/CountsList.JSON")
            .then(res => res.json())
            .then((data: IItemForCount[]) => {
                const fetchedCount = data.filter(order => order.countId === this.arguments.id)
                countModel.setProperty('/oData/countItems', fetchedCount)
            })
    }
    private fetchCount(countModel: JSONModel) {
        void fetch("/mockData/CountsList.JSON")
            .then(res => res.json())
            .then((data: ICount[]) => {
                const fetchedCount = data.find(order => order.id === this.arguments.id)
                countModel.setProperty('/oMaintain/selCount', fetchedCount)
            })
    }
}