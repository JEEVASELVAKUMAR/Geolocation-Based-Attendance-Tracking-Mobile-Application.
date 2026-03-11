const express = require('express');
const router = express.Router();
const { createOrganization, getOrganization, updateOrganization, getAllOrganizations } = require('../controllers/orgController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createOrganization)
    .get(getAllOrganizations);

router.route('/:id')
    .get(getOrganization)
    .put(protect, admin, updateOrganization);

module.exports = router;
