

<script setup>
import {
  fetchData,
  getTransactionsAndProgress,
  totalXPString,
  currentLevel,
  finishedProjectsAmount,
  levelTransactions, projectTransactions
} from "../index";
import { userQuery} from "../queries";
import {createGraphs} from "../graphs";

let user = "rahela"
let userName
let userId
await fetchData(userQuery(user)).then ((r) =>{
  userName = r.user[0].login
  userId = r.user[0].id
})

await getTransactionsAndProgress(user, userId)
let xp = totalXPString
let level = currentLevel
let finishedProjects = finishedProjectsAmount
createGraphs("#xp-chart", projectTransactions)
createGraphs("#level-chart", levelTransactions)

</script>

<template>

  <div class="greetings">
    <h3>
      Username: {{userName}}
    </h3>
    <h3>
      UserID: {{userId}}
    </h3>
    <h3>
      Total XP: {{xp}}
    </h3>
    <h3>
      Current level: {{level}}
    </h3>
    <h3>
      Transactions: {{finishedProjects}}
    </h3>

  </div>

</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}
h3 {
  font-size: 1.2rem;
  color: darkgray;
}
.greetings h1,.greetings h3 {
  text-align: center;
}
</style>