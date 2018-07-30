// $( "select" )
//   .change(function () {
//     var str = "";
//     $( "select option:selected" ).each(function() {
//       str += $( this ).text() + " ";
//     });
//     $( "custom-select" ).text( str );
//   })
//   .change();

//Get select object
// var objSelect = document.getElementById("myWeightTraining");

// //Set selected
// setSelectedValue(objSelect, "");

// function setSelectedValue(selectObj, valueToSet) {
//     for (var i = 0; i < selectObj.options.value; i++) {
//         if (selectObj.options[i].text== valueToSet) {
//             selectObj.options[i].selected = true;
//             return;
//         }
//     }
// }

document.getElementById("mySelect").value = "shoulders";

function setSelectedIndex(selected, shoulders ) {
  for ( var i = 0; i < s.options.length; i++ ) {
      if ( s.options[i].value == v ) {
          s.options[i].selected = true;
          return;
      }
  }
}