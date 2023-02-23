sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "../model/formatter", "sap/ui/core/Fragment", "sap/ui/core/IconPool", "sap/ndc/BarcodeScanner", "../model/models"], function (Controller, UIComponent, __formatter, Fragment, IconPool, BarcodeScanner, __models) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const formatter = _interopRequireDefault(__formatter);
  const models = _interopRequireDefault(__models);
  /**
   * @namespace ICL.InventoryCount.controller
   */
  const BaseController = Controller.extend("ICL.InventoryCount.controller.BaseController", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this.firstRun = true;
      this.formatter = formatter;
      this.fragments = {};
    },
    onInit: function _onInit() {
      // run only 
      if (this.firstRun) {
        this.firstRun = false;
        const countModel = this.getCountsModel();
        this.loadFilters(countModel);
        this.loadIcons();
      }
    },
    getRouter: function _getRouter() {
      return myComponent.getRouter();
    },
    getOwnerComponent: function _getOwnerComponent() {
      return Controller.prototype.getOwnerComponent.call(this);
    },
    getResourceBundle: function _getResourceBundle() {
      const oModel = this.getOwnerComponent().getModel("i18n");
      return oModel.getResourceBundle();
    },
    getModel: function _getModel(sName) {
      return this.getView().getModel(sName);
    },
    setModel: function _setModel(oModel, sName) {
      this.getView().setModel(oModel, sName);
      return this;
    },
    navTo: function _navTo(sName, oParameters, bReplace) {
      this.getRouter().navTo(sName, oParameters, undefined, bReplace);
    },
    onNavBack: function _onNavBack() {
      window.history.go(-1);
    },
    getMainView: function _getMainView() {
      return this.getView() || this.viewController.getView();
    },
    cancelFragment: function _cancelFragment(oEvent, fragmentName) {
      const id = this.getMainView().getId() + '--' + fragmentName;
      this.fragments[id].close();
    },
    onFragmentHandler: async function _onFragmentHandler(oEvent, fragmentName, isDialog) {
      const id = this.getMainView().getId() + '--' + fragmentName;
      if (!!this.fragments[id] && !isDialog && this.fragments[id].isOpen()) {
        this.cancelFragment(oEvent, fragmentName);
      } else {
        const oButton = oEvent?.getSource();
        if (!this.fragments[id]) {
          const fragment = await Fragment.load({
            name: "ICL.InventoryCount.view.fragments." + fragmentName,
            controller: this
          });
          this.fragments[id] = fragment;
          this.getView().addDependent(this.fragments[id]);
        }
        isDialog ? this.fragments[id].open() : this.fragments[id].openBy(oButton, true);
      }
    },
    deleteRowFromList: function _deleteRowFromList(aList, deleteRow) {
      //generic function for all lists
      for (let i = 0; i < aList.length; i++) {
        if (aList[i] == deleteRow) {
          aList.splice(i, 1);
          break;
        }
      }
      myComponent.getModel("LocalModel").refresh();
    },
    loadIcons: function _loadIcons() {
      const aFonts = [{
        fontFamily: "SAP-icons-TNT",
        fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
      }, {
        fontFamily: "BusinessSuiteInAppSymbols",
        fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
      }];
      aFonts.forEach(oFont => {
        IconPool.registerFont(oFont);
      });
    },
    getCountsModel: function _getCountsModel() {
      const CountsModel = myComponent.getModel("CountsModel");
      return CountsModel;
    },
    loadFilters: function _loadFilters(countModel) {
      void fetch("/mockData/CountsFilter.JSON").then(res => res.json()).then(data => countModel.setProperty('/oData/CountsFilter', data));
    },
    toggleInfo: function _toggleInfo(oEvent, modelPath) {
      const countModel = this.getCountsModel();
      countModel.setProperty(modelPath, !countModel.getProperty(modelPath));
    },
    navToCount: function _navToCount(oEvent, id) {
      myComponent.getRouter().navTo("singleCount", {
        id
      });
    },
    searchFieldExpand: function _searchFieldExpand(searchFieldId) {
      const searchField = this.getView().byId(searchFieldId);
      searchField.attachBrowserEvent('focusin', () => {
        this.toggleInfo(null, `/oFlags/${searchFieldId}Toggle`);
      });
      searchField.attachBrowserEvent('focusout', () => {
        this.toggleInfo(null, `/oFlags/${searchFieldId}Toggle`);
      });
    },
    onQRScanner: function _onQRScanner(oEvent) {
      const successCallBacl = data => {
        console.log(data);
      };
      const failCB = e => {
        console.log(e);
      };
      BarcodeScanner.scan(successCallBacl, failCB, null, myComponent.i18n('barcodescanner'));
    },
    resetModel: function _resetModel() {
      this.setModel(models.createJsonModel(), "TempModel");
      const oTempModel = this.getModel("TempModel");
      const countModel = this.getCountsModel();
      countModel.setData(oTempModel);
    },
    myNavBack: function _myNavBack(oEvent) {
      const oRouter = UIComponent.getRouterFor(this);
      if (oRouter.getRouteInfoByHash(oRouter.getHashChanger().getHash()).name === 'singleCount') {
        void this.onFragmentHandler(oEvent, 'Dialog_NavBack', true);
      } else {
        this.onNavBack();
      }
    },
    goBackHome: function _goBackHome() {
      // this.resetModel();
      this.navTo('main');
    }
  });
  return BaseController;
});
//# sourceMappingURL=BaseController.js.map