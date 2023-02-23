import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import UI5Event from "sap/ui/base/Event";
import { IItemForCount } from "./SingleCount.controller";


export type ICount = {
	id: string
	type: string
	typeDesc: string
	status: string
	statusDesc: string
	site: string
	locStorage: string
	startLoc: string
	endLoc: string
	date: string
	sla: string
	currentWork: boolean
	currentWorkName: string
}

/**
 * @namespace ICL.InventoryCount.controller
 */

export default class Main extends BaseController {

	onInit() {
		super.onInit();
		const oRouter = UIComponent.getRouterFor(this);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		oRouter.getRoute("main").attachMatched(this._initialFunc, this);
	}
	onAfterRendering() {
		this.searchFieldExpand('countsListSF')
	}

	private _initialFunc() {
		const countModel = this.getCountsModel();
		countModel.setProperty('/oMaintain/title', myComponent.i18n('InvCountTitle'));
		countModel.setProperty('/oFlags/headerNavBack', false);
		this.loadCounts(countModel)
	}
	private loadCounts(countModel: JSONModel) {
		void fetch("/mockData/CountsList.JSON")
			.then(res => res.json())
			.then(data => countModel.setProperty('/oData/CountsList', data))
	}
	private onPressCount(oEvent: UI5Event, countObj: ICount) {
		const countModel = this.getCountsModel();
		countModel.setProperty('/oMaintain/selCount', countObj);
		this.fetchItems(countModel, countObj.id)
		this.navTo('signature')
	}
	private fetchItems(countModel: JSONModel, countId: string) {
		void fetch("/mockData/itemsInCounts.JSON")
			.then(res => res.json())
			.then((data: IItemForCount[]) => {
				const fetchedCount = data.filter(order => order.countId === countId)
				countModel.setProperty('/oData/countItems', fetchedCount)
			})
	}

}
