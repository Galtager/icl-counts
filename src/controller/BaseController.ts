import AppComponent from "../Component";
import JSONModel from "sap/ui/model/json/JSONModel";

import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Router from "sap/ui/core/routing/Router";
import History from "sap/ui/core/routing/History";
import formatter from "../model/formatter";
import UI5Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import UI5Element from "sap/ui/core/Element";
import View from "sap/ui/core/mvc/View";
import Popover from "sap/m/Popover";
import Dialog from "sap/m/Dialog";
import IconPool from "sap/ui/core/IconPool";
import SearchField from "sap/m/SearchField";
import BarcodeScanner from "sap/ndc/BarcodeScanner";
import models from "../model/models";

/**
 * @namespace ICL.InventoryCount.controller
 */
export default abstract class BaseController extends Controller {
	protected viewController: Controller;
	private firstRun = true;

	public formatter = formatter;
	public fragments: {
		[key: string]: Popover | Dialog;
	} = {};
	onInit() {
		// run only 
		if (this.firstRun) {
			this.firstRun = false;

			const countModel = this.getCountsModel();
			this.loadFilters(countModel);
			this.loadIcons();
		}
	}
	private getRouter(): Router {
		return (myComponent as UIComponent).getRouter();
	}
	public getOwnerComponent(): AppComponent {
		return (super.getOwnerComponent() as AppComponent);
	}
	public getResourceBundle(): ResourceBundle | Promise<ResourceBundle> {
		const oModel = this.getOwnerComponent().getModel("i18n") as ResourceModel;
		return oModel.getResourceBundle();
	}
	public getModel(sName?: string): Model {
		return this.getView().getModel(sName);
	}
	public setModel(oModel: Model, sName?: string): BaseController {
		this.getView().setModel(oModel, sName);
		return this;
	}
	public navTo(sName: string, oParameters?: object, bReplace?: boolean): void {
		this.getRouter().navTo(sName, oParameters, undefined, bReplace);
	}
	public onNavBack(): void {
		window.history.go(-1);
	}
	private getMainView(): View {
		return this.getView() || this.viewController.getView();
	}

	public cancelFragment(oEvent: UI5Event, fragmentName: string) {
		const id = this.getMainView().getId() + '--' + fragmentName;
		this.fragments[id].close();
	}
	public async onFragmentHandler(oEvent: UI5Event, fragmentName: string, isDialog?: boolean): Promise<void> {
		const id = this.getMainView().getId() + '--' + fragmentName;
		if (!!this.fragments[id] && !isDialog && this.fragments[id].isOpen()) {
			this.cancelFragment(oEvent, fragmentName);
		}
		else {
			const oButton = oEvent?.getSource() as UI5Element;
			if (!this.fragments[id]) {
				const fragment = await Fragment.load({ name: "ICL.InventoryCount.view.fragments." + fragmentName, controller: this });
				this.fragments[id] = fragment as Dialog
				this.getView().addDependent(this.fragments[id] as UI5Element);
			}
			isDialog ? (this.fragments[id] as Dialog).open() : (this.fragments[id] as Popover).openBy(oButton, true);
		}
	}
	public deleteRowFromList<T>(aList: T[], deleteRow: T) { //generic function for all lists
		for (let i = 0; i < aList.length; i++) {
			if (aList[i] == deleteRow) {
				aList.splice(i, 1);
				break;
			}
		}
		myComponent.getModel("LocalModel").refresh();
	}
	private loadIcons() {
		const aFonts = [
			{
				fontFamily: "SAP-icons-TNT",
				fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
			},
			{
				fontFamily: "BusinessSuiteInAppSymbols",
				fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
			}
		];

		aFonts.forEach(oFont => {
			IconPool.registerFont(oFont);
		});

	}
	public getCountsModel() {
		const CountsModel = myComponent.getModel("CountsModel") as JSONModel;
		return CountsModel;
	}
	private loadFilters(countModel: JSONModel) {
		void fetch("/mockData/CountsFilter.JSON")
			.then(res => res.json())
			.then(data => countModel.setProperty('/oData/CountsFilter', data))
	}
	public toggleInfo(oEvent: UI5Event | null, modelPath: string) {
		const countModel = this.getCountsModel();
		countModel.setProperty(modelPath, !countModel.getProperty(modelPath));
	}
	public navToCount(oEvent: UI5Event, id: string) {
		myComponent.getRouter().navTo("singleCount", { id });
	}
	protected searchFieldExpand(searchFieldId: string) {
		const searchField = this.getView().byId(searchFieldId) as SearchField;
		searchField.attachBrowserEvent('focusin', () => {
			this.toggleInfo(null, `/oFlags/${searchFieldId}Toggle`)
		})
		searchField.attachBrowserEvent('focusout', () => {
			this.toggleInfo(null, `/oFlags/${searchFieldId}Toggle`)
		})

	}
	protected onQRScanner(oEvent: UI5Event) {
		const successCallBacl = (data: any) => {
			console.log(data)
		}
		const failCB = (e: any) => {
			console.log(e)
		}
		BarcodeScanner.scan(successCallBacl, failCB, null, myComponent.i18n('barcodescanner'));
	}
	protected resetModel() {
		this.setModel(models.createJsonModel(), "TempModel");
		const oTempModel = this.getModel("TempModel") as JSONModel;
		const countModel = this.getCountsModel();
		countModel.setData(oTempModel);
	}
	protected myNavBack(oEvent: UI5Event) {
		const oRouter = UIComponent.getRouterFor(this);
		if (oRouter.getRouteInfoByHash(oRouter.getHashChanger().getHash()).name === 'singleCount') {
			void this.onFragmentHandler(oEvent, 'Dialog_NavBack', true)
		}
		else { this.onNavBack() }
	}
	private goBackHome() {
		// this.resetModel();
		this.navTo('main');
	}

}
