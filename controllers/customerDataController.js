const express = require('express')
var multer = require('multer');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();
var ObjectID = require('mongoose').Types.ObjectId


var { customerData } = require('../models/customerData')
var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        console.log('file: ', file);
        cb(null, 'new' + '-' + uuidv4() + path.extname(file.originalname));
    }
});
var filter = (req, file, cb) => {
    cb(null, true)
};
let upload = multer({
    storage: storage,
    fileFilter: filter
});
router.get('/', (req, res) => {
    customerData.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while retrieving all records : ' + JSON.stringify(err, undefined, 2))
    })
})

router.get('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    customerData.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while getting a record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post('/', upload.single('file'), (req, res) => {
    var newRecord = new customerData({
        firstName: req.body.firstName,
        lastName:  req.body.lastName,
        occupation: req.body.occupation,
        status: req.body.status,
        dob: req.body.dob,
        bio: req.body.bio,
        file: req.protocol + '://' + req.get('host') + '/upload/' + req.file.filename
        // profilePicture: req.protocol + '://' + req.get('host') + '/upload/' + req.file.filename 
        // req.file && req.file.originalname 
        // req.body.dob = moment(req.body.dob, 'DD-MM-YYYY').format('MM-DD-YYYY');
    })

    newRecord.save((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while creating new record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.put('/:id',upload.single('file'), (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)
    console.log(req.body);
    var updatedRecord = {
        firstName: req.body.firstName,
        lastName:  req.body.lastName,
        occupation: req.body.occupation,
        status: req.body.status,
        dob: req.body.dob,
        bio: req.body.bio,
        file: req.file ?  req.protocol + '://' + req.get('host') + '/upload/' + req.file.filename : req.body.file
        // profilePicture: req.protocol + '://' + req.get('host') + '/upload/' + req.file.filename 
        // req.file && req.file.originalname 
        // req.body.dob = moment(req.body.dob, 'DD-MM-YYYY').format('MM-DD-YYYY');
        
    }

    customerData.findByIdAndUpdate(req.params.id, { $set: updatedRecord },{new:true}, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.delete('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    customerData.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while deleting a record : ' + JSON.stringify(err, undefined, 2))
    })
})



module.exports = router