import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ICount } from "./Main.controller";
import UI5Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import SearchField from "sap/m/SearchField";
import Link from "sap/m/Link";

type IArguments = {
    id: string
}
export type IItemForCount = {
    selected?: boolean
    personalNums?: string[]
    approve?: boolean
    deleteState?: boolean
    countId: string
    amount: string
    itemNum: string
    status: string
    statusDesc: string
    storageLoc: string
    count?: string
    type: string
    desc: string
    supplier: string
    longDesc: string
    accessType: string
    isMichlol: boolean
    unit: string

}
type IItemDetails = {
    itemNum: string
    desc: string
    unit: string
    personalNum: string
    storageType: string
    storageLoc: string
    attachment: IAttachment
}
type IAttachment = {
    name: string
    fileType: string
    base64: string
}
/**
 * @namespace ICL.InventoryCount.controller
 */
export default class SingleCount extends BaseController {
    private arguments: IArguments
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("singleCount").attachMatched(this._initialFunc, this);
    }
    onAfterRendering() {
        this.searchFieldExpand('countSF')
    }
    private _initialFunc(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/title', myComponent.i18n('countTitle'));
        this.arguments = oEvent.getParameter("arguments") as IArguments;
        const items = countModel.getProperty('/oData/countItems') as IItemForCount[]
        if (!items)
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
        void fetch("/mockData/itemsInCounts.JSON")
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
    toggleLongDesc(oEvent: UI5Event) {
        const pathToToggle = (oEvent.getSource() as Button).getBindingContext('CountsModel').getPath()
        this.toggleInfo(oEvent, `${pathToToggle}/collapse`)
    }
    onChangeAmount(oEvent: UI5Event) {
        const pathToUpdate = (oEvent.getSource() as SearchField).getBindingContext('CountsModel').getPath()
        const countModel = this.getCountsModel();
        const newValue = (oEvent.getParameter('newValue') as string);
        countModel.setProperty(`${pathToUpdate}/count`, newValue)
    }
    async openItemDetails(oEvent: UI5Event) {
        const itemSelected = (oEvent.getSource() as Link).getBindingContext('CountsModel').getObject() as IItemForCount
        const countModel = this.getCountsModel();
        const itemDetails = await this.fetchItemDetails(itemSelected.itemNum);
        countModel.setProperty('/oData/itemDetails', itemDetails);
        void this.onFragmentHandler(oEvent, 'Dialog_itemDetails', true);

    }
    fetchItemDetails(selectedId: string) {
        return fetch("/mockData/itemDetails.JSON")
            .then(res => res.json())
            .then((data: IItemDetails[]) => {
                return data.find(item => item.itemNum === selectedId)
            })

    }
    private openAttchment(oEvent: UI5Event) {
        alert('open attachment')
    }
    private openFooterScan(oEvent: UI5Event) {
        this.onQRScanner(oEvent)
    }
    onEndCountDialog(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        const items = countModel.getProperty('/oData/countItems') as IItemForCount[]
        const countedItems = items.filter(item => item.approve);

        countModel.setProperty('/oMaintain/countedItems', countedItems)
        void this.onFragmentHandler(oEvent, 'Dialog_endCount', true)

    }
    onEndCountProccess() {
        // make post requiest and update sap
        // then
        this.navTo('endCount')
    }
    approveItem(oEvent: UI5Event) {
        const countModel = this.getCountsModel();
        const selItemPath = (oEvent.getSource() as Button).getBindingContext('CountsModel').getPath();
        countModel.setProperty(`${selItemPath}/approve`, true)
    }
    choosePersonalNumber(oEvent: UI5Event) {
        const selItemPath = (oEvent.getSource() as Button).getBindingContext('CountsModel').getPath();
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/selItemForPN', selItemPath)
        this.navTo('personalNumbers');
    }
}