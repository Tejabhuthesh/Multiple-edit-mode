sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("idmulti.zmultiedit.controller.View1", {
            onInit: function () {

                // var oRouter = new sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.getRoute("RouteView1").attachPatternMatched(this.onObjectMatched,this);
                // var dataModel = that.getOwnerComponent().getModel("Students");
                // that.getView().setModel(dataModel, "Data2");
                this.onReadAll();


            },

            // onObjectMatched: function () {
            onReadAll: function () {
                var that = this;
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZEMPLOYEE_EEE_SRV/");

                oModel.read("/userSet", {
                    success: function (odata) {
                        var oModel1 = new sap.ui.model.json.JSONModel();
                        oModel1.setData(odata);
                        that.getView().setModel(oModel1, "Data1");
                        // MessageBox.success("Success");
                    },
                    error: function (oError) {
                        MessageBox.error("error");
                    }

                });
            },
            onEdit: function (oEvent) {
                this.mode = "edit";
                var that = this;

                var oTable = that.byId("idProductsTable1");
                debugger;
                var selectedRowData = oTable.getSelectedContexts();


                var myView = that.getView();
                var oDialog = myView.byId("idDialog");


                if (selectedRowData.length === 0) {
                    MessageToast.show("please select atleast one row");
                    return;
                } else {


                    if (!oDialog) {

                        oDialog = sap.ui.xmlfragment(myView.getId(), "idmulti.zmultiedit.view.Dialog", this);
                        myView.addDependent(oDialog);
                        oDialog.open();
                    }
                    else {

                        this.byId("idDialog").open();
                    }

                    // only one record
                    // for (var i = selectedRowData.length - 1; i >= 0; i--) {
                    //     var oThisObj = selectedRowData[i].getObject();
                    //     var index = $.map(sData.results, function (obj, index) {
                    //         if (obj === oThisObj) {
                    //             return index;
                    //         }
                    //     });
                    //     sData.results[index];
                    // }
                    // var oModel = new sap.ui.model.json.JSONModel();
                    // oModel.setData(sData.results[index]);
                    // that.getView().setModel(oModel, "Data3");


                    var aSelectedItems = [];                                         // ALL RECORDS SELECTED
                    for (var i = 0; i < selectedRowData.length; i++) {
                        if (selectedRowData[i].getObject()) {
                            aSelectedItems.push(selectedRowData[i].getObject());
                        }
                    }
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(aSelectedItems);
                    that.getView().setModel(oModel, "Data3");
                }
            }
            ,
            CancelPress: function () {
                this.byId("idDialog").close();
            },
            SavePress: function (oEvent) {
                var that = this;

                debugger;
                var payload = [];
                payload = oEvent.oSource.oPropagatedProperties.oModels.Data3.oData;
                for (var i = 0; i < payload.length; i++) {
                    var id = oEvent.oSource.oPropagatedProperties.oModels.Data3.oData[i].Name;
                    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZEMPLOYEE_EEE_SRV/");
                    oModel.update("/userSet('" + id + "')", payload[i], {
                        success: function (odata) {
                            MessageBox.success("Success");
                            that.onReadAll();
                        },
                        error: function (oError) {
                            MessageBox.error("error");
                        }
                    });
                }

                that.byId("idDialog").close();
                // that.onObjectMatched();
            },
        });
    });
