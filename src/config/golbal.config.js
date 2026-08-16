// Definicion global de los roles de usuario

//Retorna un objeto con todos los roles permitidos o podemos obtener solo uno de ellos
export const ROLES = {
    ADMIN: 'administrator',
    EDITOR: 'editor',
    AUTHOR: 'author',
    CONTRIBUTOR: 'contributor',
    SUSCRIBER: 'subscriber'
};

// Retorna el listado de los roles permitidos
export const ALLOWED_ROLES = Object.values( ROLES );

export const ROLE_LABELS = {
    [ROLES.ADMIN] : 'Administrador',
    [ROLES.EDITOR] : 'Editor',
    [ROLES.AUTHOR] : 'Autor',
    [ROLES.CONTRIBUTOR] : 'Contribuidor',
    [ROLES.SUSCRIBER] : 'Suscriptor'
}

// Tasa de impuesto aplicada al checkout (8%). Se calcula siempre en el
// backend a partir de los precios reales de los productos; nunca se confia
// en un total/subtotal que venga del cliente.
export const TAX_RATE = 0.08;