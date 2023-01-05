export const userQuery = (username) => {
    return `{
      user (where:{login: {_eq: "${username}"}}) {
        login
        id
      }
    }`
}

export const transactionsQuery = (username, offset) => {
    return `{
    user(where: {login: {_eq: "${username}"}}) {
        id
        login
        transactions(offset: ${offset} order_by: {createdAt: asc}) {
        
            createdAt
            amount
            type
            object{
                name
                id
                type
                }
            }
        }
    }`
}

export const progressQuery = (userId, offset) => {
    return `{
    progress(offset: ${offset} where: {userId: {_eq: "${userId}"} }) {
        id
        createdAt
        isDone
        path
        object {
            id
            name
            type
        }
        }
    }`
}
