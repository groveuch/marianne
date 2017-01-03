var JSONKey="1bq8pz?randomizer="+Math.random();
var JSONUrl="https://api.myjson.com/bins/"+JSONKey;

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

//Tab navigation
function openTab(tab) {
    var i;
    var x = document.getElementsByClassName("main");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    document.getElementById(tab).style.display = "block";  
}

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
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}	

//Remove entry
function deleteEntry(entry,type){
	
	switch(type) {
    case 'expense':
		for(var i=0; i<dataFile.plans[0].expenses.length; i++){
			if(dataFile.plans[0].expenses[i].name==entry){
			delete dataFile.plans[0].expenses[i];
			dataFile.plans[0].expenses=cleanArray(dataFile.plans[0].expenses);
			}
		}
        break;
    case 'income':
		for(var i=0; i<dataFile.plans[0].incomes.length; i++){
			if(dataFile.plans[0].incomes[i].name==entry){
			delete dataFile.plans[0].incomes[i];
			dataFile.plans[0].incomes=cleanArray(dataFile.plans[0].incomes);
			}
		}
        break;
	case 'month':
		entryId=dataFile.plans[0].duration.indexOf(entry);
			for(var i=0; i<dataFile.plans[0].duration; i++){
			dataFile.plans[0].expenses[i].values[entryId]=null;
			dataFile.plans[0].incomes[i].values[entryId]=null;
			dataFile.plans[0].expenses=cleanArray(dataFile.plans[0].expenses[i]);
			dataFile.plans[0].incomes=cleanArray(dataFile.plans[0].incomes[i]);
			}
		delete dataFile.plans[0].duration[entryId];
		dataFile.plans[0].duration=cleanArray(dataFile.plans[0].duration);			

			alert(entryId);
	break;
    default:
        alert('erreur');
	}
updateJSON(dataFile);
}	

//Adding expenses/incomes in current plan
function addEntry(){
var type=$("#type").val();
var name=$("#name").val();
var values=[];
for(i=0;i<dataFile.plans[0].duration.length;i++){
	values[i]=0;
}
	switch(type) {
    case 'expense':
        dataFile.plans[0].expenses.push({"name":name,"values":values});
        break;
    case 'income':
        dataFile.plans[0].incomes.push({"name":name,"values":values});
        break;
	case 'month':
	var i=0;
		dataFile.plans[0].duration.push(name);
		while(dataFile.plans[0].expenses[i]){
		dataFile.plans[0].expenses[i].values.push(0);
		i++;
		}
		i=0;
		while(dataFile.plans[0].incomes[i]){
		dataFile.plans[0].incomes[i].values.push(0);
		i++;
		}
    default:
        alert('erreur');
	}
updateJSON(dataFile);
}

//Function to edit table fields

$( "[id|='editable']" ).click(function(){
var name = $(this).text();
var divId = $(this).attr('id');
    $(this).html('');
    $('<input type="number"></input>')
        .attr({
            'type': 'text',
            'name': 'fname',
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
    $(divId).text(name);
	updateTotals(divId);
});

//Function to calculate the total of each column
function updateTotals(divId){
	var value = $(divId).text();
	var entryId = divId.substr(divId.indexOf('-')+1);
	var variationId = entryId.substr(1,entryId.indexOf('v')-1);
	var valueId = entryId.substr(entryId.indexOf('v')+1);
	switch(entryId.charAt(0)){
	
		case 'e':
		dataFile.plans[0].expenses[variationId].values[valueId]=Number(value);
		updateJSON(dataFile);
		break;
		
		case 'i':
		dataFile.plans[0].incomes[variationId].values[valueId]=Number(value);
		updateJSON(dataFile);
		break;
		
		default:
		alert('no match');
		break;
	}
}

//Function To Display Popup
function showLayer(selected) {
	switch (selected){
		case 0:
		document.getElementById('type').innerHTML='<option value="expense" selected>Dépense</option><option value="income">Revenu</option><option value="month">Mois</option>';
		break;
		
		case 1:
		document.getElementById('type').innerHTML='<option value="expense">Dépense</option><option value="income" selected>Revenu</option><option value="month">Mois</option>';
		break;
		
		case 2:
		document.getElementById('type').innerHTML='<option value="expense">Dépense</option><option value="income">Revenu</option><option value="month" selected>Mois</option>';
		break;
	}

document.getElementById('layer').style.display = "block";
}
//Function to Hide Popup
function hideLayer(){
document.getElementById('layer').style.display = "none";
}
	
//Table draw
function drawTable() {

	var myTable="<table id='table_div'>";
	var type='month';
	//Initiate expenses table
	myTable+="<tr id='header'><th>DEPENSES</th>";
	var totals = [[],[]];
		for (var i=0; i < dataFile.plans[0].duration.length ; i++){
			myTable+="<th>"+dataFile.plans[0].duration[i]+"<a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[0].duration[i] + "\",\"" + type + "\")' style='margin-left:25%;'>&nbsp</a></th>";
			totals[0][i]=0;
		}		
	myTable+="<th style='width:5%;'><a href='#' class='button add' onclick='showLayer(2)'>Ajouter</a></th></tr>";
	var i=0;
	type='expense';
		while (dataFile.plans[0].expenses[i]){
		myTable+="<tr ><td><a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[0].expenses[i].name + "\",\"" + type + "\")'>&nbsp</a>"+dataFile.plans[0].expenses[i].name+"</td>";
				for (j=0; j<dataFile.plans[0].expenses[i].values.length; j++){
					myTable+="<td><div id='editable-e"+i+"v"+j+"'>"+dataFile.plans[0].expenses[i].values[j]+"</div></td>";
					totals[0][j]+=Number(dataFile.plans[0].expenses[i].values[j]);
				}
		myTable+="</tr>";
		i++;
		}
	//generate totals row
	myTable+="<tr id='header'><td align='right'><a href='#' class='button add' onclick='showLayer(0)'>Ajouter</a><b>Total</b></td>";
	for (var i=0; i < dataFile.plans[0].duration.length ; i++){
			myTable+="<td id='et"+i+"' class='expenses_total'>-"+totals[0][i]+"</td>";
		}	
	myTable+="</tr>";

	
	//Initiate incomes table
	myTable+="<tr id='header'><th>REVENUS</th>";
		for (var i=0; i < dataFile.plans[0].duration.length ; i++){
			myTable+="<th>"+"</th>";
			totals[1][i]=0;
		}		
	myTable+="</tr>";
	var i=0;
	var type='income';
		while (dataFile.plans[0].incomes[i]){
		myTable+="<tr><td><a href='#' class='button delete' onclick='deleteEntry(\"" + dataFile.plans[0].incomes[i].name + "\",\"" + type + "\")'>&nbsp</a>"+dataFile.plans[0].incomes[i].name+"</td>";
				for (j=0; j<dataFile.plans[0].incomes[i].values.length; j++){
					myTable+="<td><div id='editable-i"+i+"v"+j+"'>"+dataFile.plans[0].incomes[i].values[j]+"</div></td>";
					totals[1][j]+=Number(dataFile.plans[0].incomes[i].values[j]);
				}
		myTable+="</tr>";
		i++;
		}
	//generate totals row
	myTable+="<tr id='header'><td align='right'><a href='#' class='button add' onclick='showLayer(1)'>Ajouter</a><b>Total</b></td>";
	for (var i=0; i < dataFile.plans[0].duration.length ; i++){
			myTable+="<td id='et"+i+"' class='incomes_total'>"+totals[1][i]+"</td>";
		}	
	myTable+="</tr>";
	myTable+="<tr id='header' class='capital'><th>VARIATION DE CAPITAL</th>";
			for (var i=0; i < dataFile.plans[0].duration.length ; i++){
			var total=totals[1][i]-totals[0][i];
			switch (Math.sign(total)){
			case 1:
			myTable+="<th class='incomes_total'>"+total+"</th>";
			break;
			case -1:
			myTable+="<th class='expenses_total'>"+total+"</th>";
			break;
			default:
			myTable+="<th class='incomes_total'>"+total+"</th>";
			break;
			}
		}	
	myTable+="</table>";
    document.getElementById('middle').innerHTML = myTable;   
}

