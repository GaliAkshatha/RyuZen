import express

from "express";

import{

createOrganization,

getOrganizations,

getOrganization,

}

from "../controllers/organizationController.js";

import{

createOrganizationValidation,

}

from "../validators/organizationValidator.js";

import validate

from "../../../shared/middleware/validate.js";

const router =

express.Router();

router.post(

"/",

createOrganizationValidation,

validate,

createOrganization

);

router.get(

"/",

getOrganizations

);

router.get(

"/:id",

getOrganization

);

export default router;