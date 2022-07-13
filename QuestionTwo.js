//question2.1 aggregate and group by award name
db.test.bios.mapReduce(
function(){
	if(this.awards!=null) // if there are awards
		for(var i=0; i<this.awards.length; i++) // for each award
			emit(this.awards[i].award, 1) // map <award:1>
},
function(key, value){ // reduce by key
	return Array.sum(value)
},
{out:"awardscounts"})
db.awardcounts.find()
//question2.2 report _ids grouped by birth year in an array
db.test.bios.aggregate({
	$match:{
		birth:{
			$exists:true // if birth field is valie
		}
	}
}, // gets all records where birth year exists
{
	$group:{
		_id:{
			$year:"$birth" // for year
		},
		ids:{
			$addToSet:"$_id" // add id
		}
	}
})