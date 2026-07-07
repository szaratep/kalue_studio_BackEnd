import { ALLOWED_ROLES } from "../config/golbal.config.js"
import dbGetRoles from "../service/role.service.js"

const getRoles = (req, res) => {
    
    const roles = dbGetRoles();

    res.json({
        roles
    }) 
}

export default getRoles