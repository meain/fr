export function getThread(key, state){
  let data = {}
  // console.log('state: ', state, key);
  for (var i = 0; i <  state.threads.length; i++){
    if (state.threads[i].id === key){
      data = state.threads[i].data
      break
    }
  }
  return data
}
