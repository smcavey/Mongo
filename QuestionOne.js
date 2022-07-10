//question1.1 insert records
db.test.bios.insertMany([
{
	"_id": 20,
	"name": {
		"first": "Alex",
		"last": "Chen"
	},
	"birth": ISODate("1933-08-27T04:00:00Z"),
	"death": ISODate("1984-11-07T04:00:00Z"),
	"contribs": [
	"C++",
	"Simula"
	],
	"awards": [
	{
		"award": "WPI Award",
		"year": 1977,
		"by": "WPI"
	}
	]
},
{
	"_id": 30,
	"Name": {
		"first": "David",
		"last": "Mark"
	},
	"birth": ISODate("1911-04-12T04:00:00Z"),
	"death": ISODate("2000-11-07T04:00:00"),
	"contribs": [
	"C++",
	"FP",
	"Lisp",
	],
	"awards": [
	{
		"award": "WPI Award",
		"year": 1963,
		"by": "WPI"
	},
	{
		"award": "Turing Award",
		"year": 1966,
		"by": "ACM"
	}
	]
}])
//question1.2 report all records of people who have < 3 awards or have contribs in "FP"
db.test.bios.find({
	$or: [{"contribs": "FP"}, {"awards": {$lt: 3}}]
})
//question1.3 insert a new field of type array called comments into the document of Alex Chen storing:
//"he taught in 3 universities", "died from cancer", "lived in CA"
db.test.bios.update({
	"name": {
		"first": "Alex",
		"last": "Chen"
	}
},
{
	$set: {
		"comments": [
		"He taught in 3 universities",
		"died from cancer",
		"lived in CA"
		]
	}
})
//question1.4 for each contribution by Alex Chen, list the peoples' first and last names who have the same
//contribution. output should be: {Contribution: "C++", People: [{first: Alex, last: Chen}, {first: David, last: Mark}]},
//{Contribution: "Simula"...
db.test.bios.contribs.find({
	"name": {
		"first": "Alex",
		"last": "Chen"
	}
}).forEach(
function(f){
	contributions = f.contribs
})
cursor=db.test.bios.aggregate([
	{$unwind: "$contribs"},
	{$match: { "contribs": {$in: contributions}}},
	{$group: {_id: "$contribs", people: {$push: "$name"}}}
])
cursor.forEach(printjson)
//question 1.5 report the distinct organizations that gave awards
db.test.bios.distinct("awards.by")