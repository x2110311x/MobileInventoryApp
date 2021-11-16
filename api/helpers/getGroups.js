/*jshint esversion: 6 */
const fetch = require('node-fetch');
const config = require('../config.json');
const security_groups = config.groups;

module.exports = 
function getAADGroups(token){
	return new Promise((resolve, reject) => {
		fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
			method: 'get',
			headers: { 'authorization': `Bearer ${token}` },
		})
			.then(response => response.json())
			.then(json => {
				var topRank = 99;
				var topName;
				var allGroups = [];
				for(var group of json.value){
					for(let [name, data] of Object.entries(security_groups)){
						if(data.AADID == group.id){
							allGroups.push(name);
							if(data.rank < topRank){
								topRank = data.rank;
								topName = name;
							}
						}
					}
				}
				let rData = {
					'topGroup': topName,
					'allGroups': allGroups
				};
				console.log(rData);
				resolve(rData);
			}).catch((err) => {
				reject(err);
			});
	});
};