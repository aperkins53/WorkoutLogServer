let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
let Log = require('../db').import('../models/log');

router.get('/practice', validateSession, function(req, res) {
    res.send('Hey, this is a practice route')
});

//Create Log
router.post('/', validateSession, (req, res) => {
    const entry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner_id: req.user.id
    }
    Log.create(entry)
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }))
});

//Get My Logs
router.get('/', validateSession, (req, res) => {
    let userId = req.user.id;
    Log.findAll({
        where: { owner_id: userId }
    })
        .then(logs => res.status(200).json(logs))
        .catch(err => res.status(500).json({ error: err }))
});

//Get Logs By User ID
router.get('/:id', validateSession, (req, res) => {
    let id = req.params.id;

    Log.findAll({
        where: { owner_id: id }
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({ error: err }))
});

//Update Log By Log ID
router.put('/:id', validateSession, (req, res) => {
    let updatedEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result
    };

    let query = { where: { id: req.params.id, owner_id: req.user.id }};

    Log.update(updatedEntry, query)
        .then((logs) => res.status(200).json(logs))
        .catch((err) => res.status(500).json({ error: err }));
});

//Delete Log By Log ID
router.delete('/:id', validateSession, (req, res) => {
    let query = { where: { id: req.params.id, owner_id: req.user.id }};

    Log.destroy(query)
        .then(() => res.status(200).json({ message: "Log was deleted" }))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;