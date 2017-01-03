var JSONKey="pa11j?randomizer="+Math.random();
var JSONUrl="https://api.myjson.com/bins/"+JSONKey;
var Joker=JSON.parse('{"plans": [{"name":"Plan 1","duration":["janvier","février","mars","avril"],"expenses":[{"name":"voiture","values":[110,120,100,10]},{"name":"hotel","values":[47,94,94,0]},{"name":"assurance","values":[60,60,60,60]},{"name":"salaire","values":[1000,1000,1000,1000]}],"incomes":[{"name":"formations","values":[600,0,0,0]},{"name":"frais professionels","values":[47,0,0,0]},{"name":"autres","values":[0,0,320,0]}]}]}');

//new commit

//get JSON Content
var dataFile = function(){
	var tmp = null;
	$.ajax({
		async: false,
		type:     "GET",
		url:      JSONUrl,
		dataType: "json",
		success: function(data){
			tmp = data;
		}
	});
	return tmp;
}();

//Update JSON
function updateJSON(dataFile){
var JSONUpdate=JSON.stringify(dataFile);
	$.ajax({
		url:JSONUrl,
		type:"PUT",
		data:JSONUpdate,
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		success: function(data, textStatus, jqXHR, status){
			setTimeout(location.reload(), 1);
		}
	});

}

//generate main table
drawTable();
drawTabs();


/***************/
//Tab navigation
/***************
function openTab(tab) {
    var i;
	var id='plan_'+tab;
    var x = document.getElementsByClassName("table_div");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    document.getElementById(tab).style.display = "block";  
}
*/

//Preloader graphics
function preload(){
	var elements = document.getElementsByTagName('div');
		for(i=0;i<elements.length;i++){
			if((elements[i].id)&&(elements[i].id!='feed')){document.getElementById(elements[i].id).innerHTML="<div class='preloader3'></div>";}
			console.log(elements[i].id);
		}
	}


	
//Clean null values from an array
function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]!=null) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}	

//Remove entry from expense or income
function deleteEntry(entry,type,Plan){
	
	switch(type) {
    case 'expense':
		for(var i=0; i<dataFile.plans[Plan].expenses.length; i++){
			if(dataFile.plans[Plan].expenses[i].name==entry){
			delete dataFile.plans[Plan].expenses[i];
			dataFile.plans[Plan].expenses=cleanArray(dataFile.plans[Plan].expenses);
			}
		}
        break;
    case 'income':
		for(var i=0; i<dataFile.plans[Plan].incomes.length; i++){
			if(dataFile.plans[Plan].incomes[i].name==entry){
			delete dataFile.plans[Plan].incomes[i];
			dataFile.plans[Plan].incomes=cleanArray(dataFile.plans[Plan].incomes);
			}
		}
        break;
	case 'month':
		entryId=dataFile.plans[Plan].duration.indexOf(entry);
		delete dataFile.plans[Plan].duration[entryId];
		dataFile.plans[Plan].duration=cleanArray(dataFile.plans[Plan].duration);
		for(var i=0; i<dataFile.plans[Plan].expenses.length; i++){
			delete dataFile.plans[Plan].expenses[i].values[entryId];
			dataFile.plans[Plan].expenses[i].values=cleanArray(dataFile.plans[Plan].expenses[i].values);
		}
		for(var i=0; i<dataFile.plans[Plan].incomes.length; i++){
			delete dataFile.plans[Plan].incomes[i].values[entryId];
			dataFile.plans[Plan].incomes[i].values=cleanArray(dataFile.plans[Plan].incomes[i].values);
		}
	break;
    default:
        alert('erreur');
	}
updateJSON(dataFile);
}	

//Add a new plan
function addPlan(){
dataFile.plans.push({"name":'',"duration":[],"expenses":[{"name":'',"values":[]}],"incomes":[{"name":'',"values":[]}]});
updateJSON(dataFile);
}

//Adding expenses/incomes in current plan
function addEntry(Plan){
var type=$("#type").val();
var name=$("#name").val();
var zeros=[];
for (i=0;i<dataFile.plans[Plan].duration.length; i++){zeros[i]=0;}
	switch(type) {
    case 'expense':
        dataFile.plans[Plan].expenses.push({"name":name,"values":zeros});
        break;
    case 'income':
        dataFile.plans[Plan].incomes.push({"name":name,"values":zeros});
        break;
	case 'month':
	var i=0;
		dataFile.plans[Plan].duration.push(name);
		while(dataFile.plans[Plan].expenses[i]){
		dataFile.plans[Plan].expenses[i].values.push(0);
		i++;
		}
		i=0;
		while(dataFile.plans[Plan].incomes[i]){
		dataFile.plans[Plan].incomes[i].values.push(0);
		i++;
		}
		break;
    default:
        alert('erreur : '+type);
	}
updateJSON(dataFile);
}


//Function to update the edited values in the json according to field value
function updateValues(divId){
	var value = $(divId).text();
	var variationType='';
	var entryId = divId.substr(divId.indexOf('-')+1);
	
	if(entryId.indexOf('e')!=-1){variationType='e';}
		else{variationType='i'}
		
	var planId = entryId.substr(1,entryId.indexOf(variationType)-1);
	var variationId = entryId.substr(entryId.indexOf(variationType)+1,entryId.length-entryId.indexOf('v')-1);
	var valueId = entryId.substr(entryId.indexOf('v')+1);

	switch(variationType){
	
		case 'e':
		dataFile.plans[planId].expenses[variationId].values[valueId]=Number(value);
		updateJSON(dataFile);
		break;
		
		case 'i':
		dataFile.plans[planId].incomes[variationId].values[valueId]=Number(value);
		updateJSON(dataFile);
		break;
		
		default:
		alert('no match');
		break;
	}
}

//Function To Display Popup
function showLayer(selected, Plan) {
	switch (selected){
		case 0:
		document.getElementById('addEntry').innerHTML='<img id="close" src="http://www.aorank.com/tutorial/createpopupform_livedemo/images/3.png" onclick ="hideLayer()"><h4>Ajouter une entrée</h4><br/>Type: <select id="type" name="type"><option value="expense" selected>Dépense</option><option value="income">Revenu</option><option value="month">Mois</option></select><br/><br/><input id="name" name="name" placeholder="Intitulé" type="text" size=30><br/><br/><a href="#" id="submit" onclick="addEntry('+Plan+'),hideLayer()" class="button add">Ajouter</a>';
		break;
		
		case 1:
		document.getElementById('addEntry').innerHTML='<img id="close" src="http://www.aorank.com/tutorial/createpopupform_livedemo/images/3.png" onclick ="hideLayer()"><h4>Ajouter une entrée</h4><br/>Type: <select id="type" name="type"><option value="expense">Dépense</option><option value="income" selected>Revenu</option><option value="month">Mois</option></select><br/><br/><input id="name" name="name" placeholder="Intitulé" type="text" size=30><br/><br/><a href="#" id="submit" onclick="addEntry('+Plan+'),hideLayer()" class="button add">Ajouter</a>';
		break;
		
		case 2:
		document.getElementById('addEntry').innerHTML='<img id="close" src="http://www.aorank.com/tutorial/createpopupform_livedemo/images/3.png" onclick ="hideLayer()"><h4>Ajouter une entrée</h4><br/>Type: <select id="type" name="type"><option value="expense">Dépense</option><option value="income">Revenu</option><option value="month" selected>Mois</option></select><br/><br/><input id="name" name="name" placeholder="Intitulé" type="text" size=30><br/><br/><a href="#" id="submit" onclick="addEntry('+Plan+'),hideLayer()" class="button add">Ajouter</a>';
		break;
	}
document.getElementById('layer').style.display = "block";
		
}
//Function to Hide Popup
function hideLayer(){
document.getElementById('layer').style.display = "none";
}

//Draw nagivation tabs
function drawTabs(Plan){
var Tabs='';
if(!Plan){Plan=0;}
	for (var i=0; i < dataFile.plans.length ; i++){
		if(i==Plan){
		Tabs+='<div class="tab"><a href="#" onclick="drawTable('+i+')" class="button active">Plan '+(i+1)+'</a></div>'
		}
		else{
		Tabs+='<div class="tab"><a href="#" onclick="drawTable('+i+')" class="button">Plan '+(i+1)+'</a></div>'
		}
	}
Tabs+='<!--<div class="tab"><a href="#" onclick="addPlan(),drawTable('+(i+1)+')" class="button add">Ajouter</a></div>-->'
document.getElementById('top').innerHTML = Tabs;
}
	
//Table draw
function drawTable(Plan) {

if(!Plan){Plan=0;}
	var myTable="<table id='table_div' class='table_div'>";
	var type='month';
	//Initiate expenses table
	myTable+="<tr id='header'><th>DECAISSEMENTS</th>";
	var totals = [[],[]];
		for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){
			myTable+="<th>"+dataFile.plans[Plan].duration[i]+"<a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[Plan].duration[i] + "\",\"" + type + "\",\"" + Plan + "\")' style='margin-left:25%;'>&nbsp</a></th>";
			totals[0][i]=0;
		}		
	myTable+="<th><a href='#' class='button add' onclick='showLayer(2,"+Plan+")'>Ajouter</a></th></tr>";
	var i=0;
	type='expense';
		while (dataFile.plans[Plan].expenses[i]){
		myTable+="<tr ><td><a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[Plan].expenses[i].name + "\",\"" + type + "\",\"" + Plan + "\")'>&nbsp</a>"+dataFile.plans[Plan].expenses[i].name+"</td>";
				for (j=0; j<dataFile.plans[Plan].expenses[i].values.length; j++){
					myTable+="<td><div id='editable-p"+Plan+"e"+i+"v"+j+"'>"+dataFile.plans[Plan].expenses[i].values[j]+"</div></td>";
					totals[0][j]+=Number(dataFile.plans[Plan].expenses[i].values[j]);
				}
		myTable+="</tr>";
		i++;
		}
	//generate totals row
	myTable+="<tr id='header'><td style='text-align:right;'><a href='#' class='button add' onclick='showLayer(0,"+Plan+")'>Ajouter</a><b>Total</b></td>";
	for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){
			myTable+="<td id='et"+i+"' class='expenses_total'>-"+totals[0][i]+"  €</td>";
		}	
	myTable+="</tr>";

	
	//Initiate incomes table
	myTable+="<tr id='header'><th>ENCAISSEMENTS</th>";
		for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){
			myTable+="<th>"+"</th>";
			totals[1][i]=0;
		}		
	myTable+="</tr>";
	var i=0;
	var type='income';
		while (dataFile.plans[Plan].incomes[i]){
		myTable+="<tr><td><a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[Plan].incomes[i].name + "\",\"" + type + "\",\"" + Plan + "\")'>&nbsp</a>"+dataFile.plans[Plan].incomes[i].name+"</td>";
				for (j=0; j<dataFile.plans[Plan].incomes[i].values.length; j++){
					myTable+="<td><div id='editable-p"+Plan+"i"+i+"v"+j+"'>"+dataFile.plans[Plan].incomes[i].values[j]+"</div></td>";
					totals[1][j]+=Number(dataFile.plans[Plan].incomes[i].values[j]);
				}
		myTable+="</tr>";
		i++;
		}
	//generate totals row
	myTable+="<tr id='header'><td style='text-align:right;'><a href='#' class='button add' onclick='showLayer(1,"+Plan+")'>Ajouter</a><b>Total</b></td>";
	for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){
			myTable+="<td id='et"+i+"' class='incomes_total'>"+totals[1][i]+"  €</td>";
		}	
	myTable+="</tr>";
	myTable+="<tr id='header' class='capital'><th>VARIATION DE CAPITAL</th>";
	var rollingTotal=[];
	rollingTotal[-1]=0;
			for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){
			var total=totals[1][i]-totals[0][i];
			rollingTotal[i]=rollingTotal[i-1]+total;
				switch (Math.sign(total)){
				case 1:
				myTable+="<th class='incomes_total'>"+total+"  €</th>";
				break;
				case -1:
				myTable+="<th class='expenses_total'>"+total+"  €</th>";
				break;
				default:
				myTable+="<th class='incomes_total'>"+total+" €</th>";
				break;
				}
			}
			myTable+="<tr id='header' class='capital'><th>CUMUL</th>";
			for (var i=0; i < dataFile.plans[Plan].duration.length ; i++){myTable+="<th class='capital'>"+rollingTotal[i]+" €</th>";}		
	myTable+="</table>";
	document.getElementById('middle').innerHTML = '';
    document.getElementById('middle').innerHTML = myTable;
	drawTabs(Plan);
	
	
//Function to edit table fields, to be reloaded each time the table is generated to make sure div-IDs don't conflict

$( "[id|='editable']" ).click(function(){
var name = $(this).text();
if((name == 0)){name='';}
var divId = $(this).attr('id');
    $(this).html('');
    $('<input></input>')
        .attr({
			'onblur':'',
            'type': 'number',
            'name': 'fname',
			'class': 'input add',
            'id': 'txt_fullname-'+divId,
            'size': '10',
            'value': name
        })
        .appendTo("#"+divId);
    $('#txt_fullname-'+divId).focus();
});
		$( document ).on('blur', "[id|='txt_fullname-editable']", function(){
			var name = $(this).val();
			var divId = $(this).attr('id');
			divId = "#"+divId.substr(divId.indexOf('editable-'));
			$(divId).text(Math.max(0,name));
			updateValues(divId);
		});

}	