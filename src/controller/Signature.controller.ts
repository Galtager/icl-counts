/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import UI5Event from "sap/ui/base/Event";
import VBox from "sap/m/VBox";
import { ICount } from "./Main.controller";
type ISignature = string
/**
 * @namespace ICL.InventoryCount.controller
 */
export default class EndCountForm extends BaseController {


    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("signature").attachMatched(this._initialFunc, this);

    }
    onAfterRendering() {
        const vbox = this.getView().byId('signaturePad') as VBox;
        const signaturePad = vbox.getItems()[0];
        signaturePad.attachBrowserEvent('touchend', () => {
            const countModel = this.getCountsModel();
            countModel.setProperty('/oMaintain/signature', true)
        })
    }
    private _initialFunc() {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/title', myComponent.i18n('startCountTitle'));
        countModel.setProperty('/oFlags/headerNavBack', true);
        const selCount = countModel.getProperty('/oMaintain/selCount') as ICount;
        if (!selCount)
            this.onNavBack()

    }
    sendCount(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        const selCount = countModel.getProperty('/oMaintain/selCount') as ICount;
        // call post serivce
        this.navToCount(oEvent, selCount.id)

    }
    cleanSign(oEvent: Event) {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/countedForm/signature', true)
        const VBox = this.getView().byId('signaturePad') as VBox;
        const signaturePad: any = VBox.getItems()[0];
        signaturePad.clear()
        countModel.setProperty('/oMaintain/signature', false)

    }
}