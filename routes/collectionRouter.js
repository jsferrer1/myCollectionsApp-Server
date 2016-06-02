var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Collections = require('../models/collections');

var collectionRouter = express.Router();
collectionRouter.use(bodyParser.json());

// handle collections

collectionRouter.route('/')
.get(function (req, res, next) {
    Collections.find(req.query) 
        .populate('comments.postedBy')
        .exec(function (err, collection) {        
        if (err) next(err);
        res.json(collection);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.create(req.body, function (err, collection) {
        if (err) next(err);
        console.log('Collection created! ' + JSON.stringify(collection));
        var id = collection._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the collection with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

// handle collectionId

collectionRouter.route('/:collectionId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.findById(req.params.collectionId)
        .populate('comments.postedBy')
        .exec(function (err, collection) {
        if (err) next(err);
        res.json(collection);
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.findByIdAndUpdate(req.params.collectionId, {
        $set: req.body
    }, {
        new: true
    }, function (err, collection) {
        if (err) next(err);
        res.json(collection);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.findByIdAndRemove(req.params.collectionId, function (err, resp) {        
        if (err) next(err);
        res.json(resp);
    });
});

// handle comments

collectionRouter.route('/:collectionId/comments')
.get(function (req, res, next) {
    Collections.findById(req.params.collectionId, function (err, collection) {
        if (err) next(err);
        res.json(collection.comments);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Collections.findById(req.params.collectionId, function (err, collection) {
        if (err) next(err);
        req.body.postedBy = req.decoded._id; // user objectId
        collection.comments.push(req.body);
        collection.save(function (err, collection) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(collection);
        });
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Collections.findById(req.params.collectionId, function (err, collection) {
        if (err) next(err);
        for (var i = (collection.comments.length - 1); i >= 0; i--) {
            collection.comments.id(collection.comments[i]._id).remove();
        }
        collection.save(function (err, result) {
            if (err) next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

collectionRouter.route('/:collectionId/comments/:commentId')
.get(function (req, res, next) {
    Collections.findById(req.params.collectionId)
        .populate('comments.postedBy')
        .exec(function (err, collection) {
        if (err) next(err);
        res.json(collection.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Collections.findById(req.params.collectionId, function (err, collection) {
        if (err) next(err);
        collection.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id; // user objectId
        collection.comments.push(req.body);
        collection.save(function (err, collection) {
            if (err) next(err);
            console.log('Updated Comments!');
            res.json(collection);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Collections.findById(req.params.collectionId, function (err, collection) {
        if (collection.comments.id(req.params.commentId).postedBy
           != req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        collection.comments.id(req.params.commentId).remove();
        collection.save(function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });
});

module.exports = collectionRouter;