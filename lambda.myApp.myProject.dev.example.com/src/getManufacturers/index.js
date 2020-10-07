const fetch = require("node-fetch");
const url = "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json";
const modelUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/";
const responseObj = require("./models/responseModel.json");

async function getModelData(makeId){
    console.log("API >>> "+modelUrl+makeId+"?format=json");
    const response = await fetch(modelUrl+makeId+"?format=json");
    const modelData = await response.json();
    let modelTempObj = {};
    let modelTempArray = [];
    modelData.Results.forEach(model => {
        modelTempArray.push(model.Model_Name);
    });
    modelTempObj.makerId = modelData.SearchCriteria.split(':')[1];
    modelTempObj.makerName = modelData.Results[0].Make_Name;
    modelTempObj.models = modelTempArray;
    //return modelData;
    return modelTempObj;
}

async function getMakers(){
    try{
        const response = await fetch(url);
        const data = await response.json();
        /*let tempJson = {};
        tempJson.count = data.Count;
        tempJson.makeId = data.Results[0].Make_ID;
        tempJson.makeName = data.Results[0].Make_Name;*/
        let tempArray = [];
        let modelArray = [];
        for(let i=0;i<4;i++){
            tempArray.push(data.Results[i].Make_ID);
        }
        console.log("Array values are:"+tempArray);

        for(let j=0;j<tempArray.length;j++){
            console.log("Requesting value for maker id :"+tempArray[j]);
            let modelData = await getModelData(tempArray[j]);
            modelArray.push(modelData);
        }
        responseObj.statusCode = 200;
        responseObj.body = JSON.stringify(modelArray);
        return responseObj;
    }
    catch(error){
        console.log("Error Occured.");
    }
}

exports.lambdaHandler = async (event) => {
    let apiCall = await getMakers();
    return apiCall;
}