import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ICount } from "./Main.controller";
import UI5Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import SearchField from "sap/m/SearchField";
import Link from "sap/m/Link";
import { IItemForCount } from "./SingleCount.controller";

/**
 * @namespace ICL.InventoryCount.controller
 */
export default class EndCount extends BaseController {

    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("endCount").attachMatched(this._initialFunc, this);
    }
    private _initialFunc(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/title', myComponent.i18n('endCount'));
        const countedItems = countModel.getProperty('/oMaintain/countedItems') as IItemForCount[]
        // if (!countedItems) {
        //     this.onNavBack()
        // }
    }
    acceptCount(oEvent: UI5Event) {
        void this.onFragmentHandler(oEvent, 'Dialog_Success', true)
    }
    cancelDlt(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        const countedItems = countModel.getProperty('/oMaintain/countedItems') as IItemForCount[]
        countedItems.map(el => delete el.deleteState)
        this.toggleInfo(oEvent, '/oFlags/endCountEdit')
    }
    deleteitems(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        const countedItems = countModel.getProperty('/oMaintain/countedItems') as IItemForCount[]
        const remainItems = countedItems.filter(el => !el.deleteState)
        countModel.setProperty('/oMaintain/countedItems', remainItems);
        this.toggleInfo(oEvent, '/oFlags/endCountEdit')


    }


}