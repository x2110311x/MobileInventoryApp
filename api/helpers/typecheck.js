/*jshint esversion: 6 */
module.exports = {
	checkFloat: function(num){
		if(!num) return;
		let retVar = parseFloat(num);
		if(isNaN(retVar)){
			return;
		} else {
			return retVar;
		}
	},
	checkInt: function(num){
		if(!num) return;
		let retVar = parseInt(num);
		if(isNaN(retVar)){
			return;
		} else {
			return retVar;
		}
	},
	checkBool: function(str){
		if(!str) return;
		if(str.toString().toLowerCase() == 'true'){
			return true;
		} else if (str.toString().toLowerCase() == 'false') {
			return false;
		} else {
			return;
		}
	}
};