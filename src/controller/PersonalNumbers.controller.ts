/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import { IItemForCount } from "./SingleCount.controller";
import Event from "sap/ui/base/Event";
import Input from "sap/m/Input";

/**
 * @namespace ICL.InventoryCount.controller
 */
export default class PersonalNumbers extends BaseController {
    onInit() {
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("personalNumbers").attachMatched(this._initialFunc, this);
    }

    private _initialFunc() {
        const countModel = this.getCountsModel();
        const selectedItemPath = countModel.getProperty('/oMaintain/selItemForPN') as string
        const selectedItem = countModel.getProperty(selectedItemPath) as IItemForCount;
        const DeppClone = structuredClone(selectedItem) as IItemForCount

        if (DeppClone) {
            if (!DeppClone.personalNums)
                DeppClone.personalNums = new Array<string>(+DeppClone.count);
            countModel.setProperty('/oMaintain/tempSelectedItem', DeppClone);
        }
        else { this.onNavBack() }
    }
    savePersonalNumbers() {
        const countModel = this.getCountsModel();
        const selectedItemPath = countModel.getProperty('/oMaintain/selItemForPN') as string
        const itemModified = countModel.getProperty('/oMaintain/tempSelectedItem') as IItemForCount
        const DeppClone = structuredClone(itemModified) as IItemForCount
        DeppClone.approve = true
        countModel.setProperty(selectedItemPath, DeppClone);

        this.onNavBack()
    }
    changeNumber(oEvent: Event) {
        const pathToUpdate = (oEvent.getSource() as Input).getBindingContext('CountsModel').getPath()
        const countModel = this.getCountsModel();
        const newValue = (oEvent.getParameter('newValue') as string);
        countModel.setProperty(pathToUpdate, newValue)

    }
}