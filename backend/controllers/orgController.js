const Organization = require('../models/Organization');

exports.createOrganization = async (req, res) => {
    const { name, latitude, longitude, geofenceRadius, departments } = req.body;

    const org = await Organization.create({
        name,
        location: { latitude, longitude },
        geofenceRadius,
        departments
    });

    res.status(201).json(org);
};

exports.getOrganization = async (req, res) => {
    const org = await Organization.findById(req.params.id);

    if (org) {
        res.json(org);
    } else {
        res.status(404).json({ message: 'Organization not found' });
    }
};

exports.updateOrganization = async (req, res) => {
    const { name, latitude, longitude, geofenceRadius, departments } = req.body;

    const org = await Organization.findById(req.params.id);

    if (org) {
        org.name = name || org.name;
        org.location.latitude = latitude || org.location.latitude;
        org.location.longitude = longitude || org.location.longitude;
        org.geofenceRadius = geofenceRadius || org.geofenceRadius;
        org.departments = departments || org.departments;

        const updatedOrg = await org.save();
        res.json(updatedOrg);
    } else {
        res.status(404).json({ message: 'Organization not found' });
    }
};

exports.getAllOrganizations = async (req, res) => {
    const orgs = await Organization.find({});
    res.json(orgs);
};
