'use client'
import { useState,useEffect } from "react";
import Image from "next/image";
import PocketBase from 'pocketbase'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
export default function Home() {
  const pb = new PocketBase('http://172.16.15.138:8080')
  const [komp,setKomp] = useState(null)
  const [dane,setDane] = useState({nazwa: null,cena: null,opis: null})
  const [zdjecie,setZdjecie] = useState(null)
  useEffect(()=>{
    const getData = async ()=>{
      try{
        const records = await pb.collection('komputery').getFullList({
          sort: '-created',
      });
      setKomp(records)
      }catch(err){
        console.log(err)
      }
    }
    getData()
  },[])
  
  const inputChange = (e)=>{
    const formData = new FormData()
    formData.append("nazwa",dane.nazwa)
    formData.append("cena",dane.cena)
    formData.append("opis",dane.opis)
    //formData.append('zdjecie',zdjecie)
    try{
      console.log(e.target.value)
      setDane(formData)
      console.log(formData)
      console.log(dane)
    }catch(err){
      console.log(err)
    }
  }
  const del = async(item)=>{
    try{
    await pb.collection('komputery').delete(item.id);
    
    }catch(err){
      console.log(err)
    }
    setKomp([...komp])
  }
  const dod = async()=>{
    const record = await pb.collection('komputery').create(dane);
    setKomp([...komp,record])
  }
  const inputEdit = ()=>{
    const formData = new FormData()
    formData.append("nazwa",dane.nazwa)
    formData.append("cena",dane.cena)
    formData.append("opis",dane.opis)
    try{
      setDane(formData)
    }catch(err){

    }
  }
  const edit = async(item)=>{
    const record = await pb.collection('komputery').update(item.id, dane);
    setKomp([...komp])
  }
  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      {komp && komp.map((item)=>(
        <Card key={item.id} className="w-auto h-auto">
        <CardHeader>
          <Image 
          src={pb.files.getUrl(item,item.zdjecie)}
          alt={item.nazwa}
          width={200}
          height={100}
          >
          </Image>
          <CardTitle>{item.nazwa}</CardTitle>
          <CardDescription>{item.cena}</CardDescription>
        </CardHeader>
        <CardContent>
          {item.opis}
        </CardContent>
        <CardContent>

        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nazwa" className="text-right">
              Nazwa
            </Label>
            <Input
              id="nazwa"
              defaultValue={item.nazwa}
              //onChange={(e)=>(inputEdit(e,"nazwa"))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cena" className="text-right">
              Cena
            </Label>
            <Input
              id="cena"
              type="number"
              //onChange={(e)=>(inputEdit(e,"cena"))}
              defaultValue={item.cena}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="opis" className="text-right">
              Opis
            </Label>
            <Input
              id="opis"
              //onChange={(e)=>(inputEdit(e,"opis"))}
              defaultValue={item.opis}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {/* <Button onClick={edit(item)}>Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
          
          <AlertDialog>
  <AlertDialogTrigger asChild><Button>Usuń</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      {/* <AlertDialogAction asChild><Button onClick={del({item})}>Continue</Button></AlertDialogAction>   */}
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        </CardContent>
        
      </Card>
      
      ))}
      <Card>
  <CardHeader>
    <CardTitle>Dodawanie</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col gap-3 justify-center">
      <div>
        Nazwa
        <Input onChange={(e)=>{inputChange(e,"nazwa")}} type="text" name="nazwa" id="nazwa" placeholder="nazwa"/>
      </div>
      <div>
        Cena
        <Input onChange={(e)=>{inputChange(e,"cena"==e.target.value)}} type="number" name="cena" id="cena" placeholder="cena"/>
      </div>
      <div>
        Opis
        <Input onChange={(e)=>{inputChange(e,"opis")}} type="text" name="opis" id="opis" placeholder="opis"/>
      </div>
      {/* <div>
        Zdjecie
        <Input onChange={(e)=>{inputChange(e,'zdjecie')}} type="file" id="zdjecie" placeholder="zdjecie"/>
      </div> */}
    </div>
  </CardContent>
  <CardFooter>
    <Button onClick={dod}>Dodaj</Button>
  </CardFooter>
</Card>
    </div>
  );
}
