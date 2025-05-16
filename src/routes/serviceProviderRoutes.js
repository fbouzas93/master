const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');

router.post('/', serviceProviderController.create);
router.get('/', serviceProviderController.getAll);
router.get('/:id', serviceProviderController.getById);
router.put('/:id', serviceProviderController.update);
router.delete('/:id', serviceProviderController.delete);

module.exports = router;