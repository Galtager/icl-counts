import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import UIComponent from "sap/ui/core/UIComponent";
import SearchField from "sap/m/SearchField";
import StandardListItem from "sap/m/StandardListItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IItemForCount } from "./SingleCount.controller";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import models from "../model/models";

type ISearchFieldKey = 'fromSF' | 'toSF'
type ILocation = { key: string };
type ICreatedCount = { id: string }
/**
 * @namespace ICL.InventoryCount.controller
 */
export default class CreateCount extends BaseController {
    onInit() {
        super.onInit();
        const oRouter = UIComponent.getRouterFor(this);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        oRouter.getRoute("createCount").attachMatched(this._initialFunc, this);
    }
    onAfterRendering() {
        this.searchFieldExpand('fromSF')
        this.searchFieldExpand('toSF')
    }

    private _initialFunc(oEvent: Event) {
        const countModel = this.getCountsModel();
        this.initModelState(countModel)

        this.fetchItems(countModel)
        this.fetchLoactions(countModel)
        countModel.setProperty('/oMaintain/title', myComponent.i18n('createCount'));
        countModel.setProperty('/oFlags/headerNavBack', true);

    }

    private initModelState(countModel: JSONModel) {
        countModel.setProperty('/oMaintain/createCount/tabKey', '1');
        countModel.setProperty('/oMaintain/createCount/currStep', '1')
        countModel.setProperty('/oFlags/iturSearch', false);
        countModel.setProperty('/oMaintain/createCount/newItems', []);
    }
    private fetchItems(countModel: JSONModel) {
        void fetch("/mockData/itemsInCounts.JSON")
            .then(res => res.json())
            .then((data: IItemForCount[]) => {
                countModel.setProperty('/oData/itemsToAdd', data)
            })
    }
    private fetchLoactions(countModel: JSONModel) {
        countModel.setProperty('/oData/locations', [
            { key: "I01/I01" },
            { key: "I01/I02" },
            { key: "I01/I03" },
            { key: "I01/I04" },
            { key: "I01/I05" },
            { key: "I01/I06" },
            { key: "I01/I07" },
            { key: "I01/I08" },
        ]
        );
    }
    protected searchFieldExpand(searchFieldId: ISearchFieldKey) {
        const countModel = this.getCountsModel();
        const searchField = this.getView().byId(searchFieldId) as SearchField;
        searchField.attachBrowserEvent('focusin', () => {
            // save old values
            const iturSearchState = countModel.getProperty('/oFlags/iturSearch') as boolean
            if (!iturSearchState) {
                countModel.setProperty('/oMaintain/createCount/oldToSF', countModel.getProperty('/oMaintain/createCount/toSF') || "");
                countModel.setProperty('/oMaintain/createCount/oldFromSF', countModel.getProperty('/oMaintain/createCount/fromSF') || "");
            }
            countModel.setProperty('/oFlags/iturSearchFocus', searchFieldId);
            countModel.setProperty('/oFlags/iturSearch', true);
        })

    }
    returnFromLocateSeacrh() {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oFlags/iturSearch', false);
        countModel.setProperty('/oMaintain/createCount/toSF', countModel.getProperty('/oMaintain/createCount/oldToSF'));
        countModel.setProperty('/oMaintain/createCount/fromSF', countModel.getProperty('/oMaintain/createCount/oldFromSF'));

    }
    acceptLocate(oEvent: Event) {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oFlags/iturSearch', false);
        const from = countModel.getProperty('/oMaintain/createCount/fromSF') as string;
        const to = countModel.getProperty('/oMaintain/createCount/toSF') as string;
        const itemsList = this.getView().byId('itemsToAdd') as List,
            oBinding = itemsList.getBinding("items") as ListBinding,
            aFilter = [
                new Filter('storageLoc', FilterOperator.BT, from, to),
            ];
        if (!!from && !!to)
            oBinding.filter(aFilter);
        else
            oBinding.filter(null)
    }
    selectLocation(oEvent: Event) {
        const countModel = this.getCountsModel();
        const selItem = (oEvent.getSource() as StandardListItem).getBindingContext('CountsModel').getObject() as ILocation;
        const focusedInput = countModel.getProperty('/oFlags/iturSearchFocus') as ISearchFieldKey;
        countModel.setProperty(`/oMaintain/createCount/${focusedInput}`, selItem.key);
        if (focusedInput === 'fromSF')
            (this.getView().byId('toSF') as SearchField).focus()
    }
    checkSelected(oEvent: Event) {
        const countModel = this.getCountsModel();

        if (!oEvent.getParameter('selected')) {
            // check there is some selected
            const items = countModel.getProperty('/oData/itemsToAdd') as IItemForCount[];
            const atLeastOne = items.find(item => item.selected);
            countModel.setProperty('/oFlags/itemsToAddSelected', !!atLeastOne)
        }
        else {
            countModel.setProperty('/oFlags/itemsToAddSelected', true)
        }
    }
    checkDelete(oEvent: Event) {
        const countModel = this.getCountsModel();
        if (!oEvent.getParameter('selected')) {
            // check there is some selected
            const items = countModel.getProperty('/oMaintain/createCount/newItems') as IItemForCount[];
            const atLeastOne = items.find(item => item.deleteState);
            countModel.setProperty('/oFlags/itemsToDelete', !!atLeastOne)
        }
        else {
            countModel.setProperty('/oFlags/itemsToDelete', true)
        }
    }
    addToList() {
        const countModel = this.getCountsModel();
        const items = countModel.getProperty('/oData/itemsToAdd') as IItemForCount[];
        const selectedItems = items.filter(item => item.selected);
        countModel.setProperty('/oMaintain/createCount/newItems', selectedItems);
        countModel.setProperty('/oMaintain/createCount/tabKey', '2');
    }
    removeFromList() {
        const countModel = this.getCountsModel();
        const items = countModel.getProperty('/oMaintain/createCount/newItems') as IItemForCount[];
        const deleteItems = items.filter(item => !item.deleteState);
        countModel.setProperty('/oMaintain/createCount/newItems', deleteItems)
    }
    onCreateCount() {
        const countModel = this.getCountsModel();
        countModel.setProperty('/oMaintain/createCount/currStep', '2');
        // post request to get the new created count
        countModel.setProperty('/oData/createdCount', { id: '1234567890' })

    }
    onStartCount(oEvent: Event) {
        const countModel = this.getCountsModel();
        const createdCount = countModel.getProperty('/oData/createdCount') as ICreatedCount
        this.navToCount(oEvent, createdCount.id)
    }

}