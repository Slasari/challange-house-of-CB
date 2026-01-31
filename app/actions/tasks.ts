"use server" 

import { getSupabaseServer } from "@/lib/supabaseClient";
import decoderToken from "./decoderToken";


export async function getTasksAction(){

    const supabase = await getSupabaseServer()
    const {userId} = await decoderToken() as {userId: string}
    const {data, error} = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {ascending: false});

    if(error) throw error;
    return data
}

export async function addTaskAction(title: string){
    const supabase = await getSupabaseServer()
    const {userId} = await decoderToken() as {userId: string}
    const {data, error} = await supabase
    .from("tasks")
    .insert({title, user_id: userId})
    .select()
    console.log({error, data})
    if(error) return {error: error.message, data: null}
    return {data, error: null}
}

export async function deleteTaskAction (taskId: string) {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if(error){
        return error.message
    }

}
interface updateTask {
    taskId: string;
    title: string;
}
export async function updateTaskAction ({taskId, title}: updateTask){
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("tasks")
      .update({ title: title })
      .eq("id", taskId)
      .select();

      if(error){
        return {error: error.message, data: null}
      }
      return {data, error: null}
}

interface toggleTask {
    taskId: string;
    completed: boolean;
}
export async function toggleTaskAction ({taskId, completed}: toggleTask){
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: completed })
      .eq("id", taskId)
      .select();

      if(error){
        return {error: error.message, data: null}
      }
      return {data, error: null}
}