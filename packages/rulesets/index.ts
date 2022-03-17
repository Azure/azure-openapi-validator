import { join } from "path"
function getRuleSetFile(filename:string) {
  return  join (__dirname ,"output", filename +'.js')
}
export const spectralCommonFile = ()=> getRuleSetFile("common")
export const spectralArmFile = ()=> getRuleSetFile("arm")

export const rulesets = {

}
