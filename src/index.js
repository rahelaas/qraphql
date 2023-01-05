import {progressQuery, transactionsQuery} from "./queries";

export let totalXPString = ""
export let currentLevel = 0
export let finishedProjectsAmount = 0
export let levelTransactions = []
export let projectTransactions = []


export async function fetchData (query)  {

    let response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        })
    });
    let result = await response.json();
    return result.data
}



export let getTransactionsAndProgress = async (user, userId) => {

    let {xpTransactionsWithAudits, levelTransactions} = await getTransactions(user)
    // array of finished projects, no XPs
    let projectsFinished = await getProgress(userId)

    finishedProjectsAmount = projectsFinished.length

    let levelLength = levelTransactions.length
    currentLevel = levelTransactions[levelLength - 1].amount
    let transactionsOfProjects = []
    transactionsOfProjects = removeAuditsFromTransactions(projectsFinished, xpTransactionsWithAudits)

    projectTransactions = []
    projectTransactions = modifyTransactionsData(transactionsOfProjects)

    let addingXps = 0
    // sort transactions by date
    projectTransactions.sort((a,b)=>a.createdAt.getTime() - b.createdAt.getTime());
    for (let transaction of projectTransactions) {
        let xp = transaction.amount / 1000
        addingXps += xp
        transaction.xpSum = addingXps
    }


    console.log("transactions", projectTransactions)
    getTotalXpString(projectTransactions)

}



let modifyTransactionsData = function (transactions) {
let newArray = []
    for (let transaction of transactions) {
        newArray.push( {
            createdAt: new Date(Date.parse(transaction.createdAt)),
            amount: transaction.amount,
            xpSum: 0,
            name: transaction.object.name
        })
    }
    return newArray
}



let removeAuditsFromTransactions = function (projectsFinished, transactions){
    let oneProjectArray = []
    let xpTransactions = []

    // loop through finished projects and transactions, find matches
    for (let project of projectsFinished) {
        transactions.forEach(function(item) {
            if (item.object.id === project.object.id) {
                oneProjectArray.push(item)
            }
        })

        if (oneProjectArray.length === 1) {
            xpTransactions.push(oneProjectArray[0])
        } else if (oneProjectArray.length > 1) {
            // in case there are xp points for audits, keep the transaction with the biggest xp points
            for (let i = 1; i < oneProjectArray.length; i++ ) {
                if (oneProjectArray[i-1].amount > oneProjectArray[i].amount) {
                    xpTransactions.push(oneProjectArray[i-1])
                    break
                } else if (oneProjectArray[i-1].amount < oneProjectArray[i].amount) {
                    xpTransactions.push(oneProjectArray[i])
                    break
                }
            }
        }
        oneProjectArray = []
    }
    return xpTransactions
}



let getTransactions = async (user) => {

    let offset = 0
    let allTransactions = []
    let transactionQuery = []

    while(true) {
        transactionQuery = await fetchData(transactionsQuery(user, offset))

        if (transactionQuery.user[0].transactions.length === 0 ) {
            break
        }
        allTransactions.push(...transactionQuery.user[0].transactions)
        offset += 50
    }

    levelTransactions = allTransactions.filter(transaction => (transaction.type === 'level' && (transaction.object.type === 'project' || transaction.object.type === 'piscine')))

    for (let transaction of levelTransactions) {
        transaction.createdAt = new Date(Date.parse(transaction.createdAt))
    }

    levelTransactions.sort((a,b)=>a.amount - b.amount);

   let xpTransactionsWithAudits = allTransactions.filter(transaction =>(transaction.type === 'xp' && (transaction.object.type === 'project' || transaction.object.type === 'piscine')))
    console.log("levels", levelTransactions)

return {xpTransactionsWithAudits, levelTransactions}
}



let getProgress = async (userId) => {

    let offset = 0
    let doneProjects = []

    while (true) {
        let progress = await fetchData(progressQuery(userId, offset))
        if (progress.progress.length === 0) {
            break
        }
        doneProjects.push(...progress.progress)
        offset += 50

    }
let filteredProjects = doneProjects.filter(project => (project.isDone === true && (project.object.type === 'project' || project.object.type === 'piscine')))
    filteredProjects = filteredProjects.filter(project => project.path !== "/johvi/piscine-go")

    // remove duplicates
    return filteredProjects.filter((v, i, a) => a.findIndex(v2 => (v2.path === v.path)) === i)
}



function roundXp (xp) {
    xp = (xp / 1000 )
    if (xp < 11) {
        xp = xp.toFixed(2)
    } else if (xp >= 11 && xp < 100) {
        xp = xp.toFixed(1)
    } else if (xp >= 100) {
        xp = xp.toFixed(0)
    }
    return xp
}



 let getTotalXpString = function (transactions){
    let totalXp = 0
    for ( let project of transactions) {
        totalXp += project.amount
    }
    if (totalXp >= 1000000) {
        totalXPString = String((totalXp / 1000000).toFixed(2))+" MB"
    } else if (totalXp < 1000000) {
        totalXp = roundXp(totalXp)
        totalXPString = String(totalXp) + " kB"
    }
}