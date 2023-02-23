import React from 'react';
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Icon from "../images/avatar.jpg"
import Base64URL from "../services/convertToBase64";
import {fromIsoToDateString} from "../services/helper"


export default function TodoTile({ active, removeTask, todo, changeSpecific, updateName, attachImage, uploadToCloud }) {
    let [toggle, setToggle] = useState(false)
    let [temp_picture, setPicture] = useState('')
    const inputRef = useRef(null)
    const imgRef = useRef(null)

    const navigate = useNavigate();
    function changePage() {
        navigate(`/todo/${todo.id}`)
    }

    function notification(message) {
        toast(message, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    function flipTheSwitch(item, e) {
        changeSpecific(item, e.target.checked)
    }
    function handleClick() {
        removeTask(todo.id)
    }
    function handleNameChange(item, e) {
        updateName(item, e.target.value)
    }
    var pic = null
    const uploadPhoto = async (event) => {
        pic = event.target.files[0]
        let base64 = await Base64URL(pic)
        if(base64){
            notification('Uploaded.')
        }
        setPicture(base64)
        attachImage(todo.id, pic)
    }
    function triggerUpload() {
        imgRef.current.click()
    }
    function send() {
        if(todo.photo){
            uploadToCloud(todo)
        }
        else{
            notification('Please select a picture to save todo.')
        }
    }
    return (
        <div>
            <li className={active ? 'list-group-item hover active' : 'list-group-item hover'}>
                <small className="text-muted pull-right"> {fromIsoToDateString(todo?.start_date)} - {fromIsoToDateString(todo?.end_date)}</small>
                <small className="text-muted pull-right"></small>
                <span onClick={triggerUpload} className="height" >
                    <img height="20" length="20" src={todo.image_link ? todo.image_link : temp_picture || Icon} alt="Todo" />
                </span>
                <span onClick={send} className="touch ml-2"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" /><path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L17 2.586A2 2 0 0 0 15.586 2H6Zm10.238 8.793a1 1 0 1 0-1.414-1.414l-4.242 4.242l-1.415-1.414a1 1 0 0 0-1.414 1.414l2.05 2.051a1.1 1.1 0 0 0 1.556 0l4.88-4.879Z" /></g></svg></span>
                <span onClick={changePage} className="touch ml-2"><i className="fa fa-eye"></i></span>
                <div className="view" id="task-3">
                    <button onClick={handleClick} className="destroy close hover-action">×</button>
                    <div onClick={() => {
                        setToggle(false)
                        if (inputRef.current) {
                            inputRef.current.focus()
                        }
                    }} className="checkbox">
                        <input checked={todo.complete} onChange={(event) => {
                            flipTheSwitch(todo.id, event)
                        }} className="toggle ml-2" type="checkbox" />
                        {
                            <div>
                                <span className={todo.complete ? 'task-name done' : 'text-mute'}><span className={todo.active ? 'text-white' : 'text-mute'} >{todo.description}</span></span>
                                <input ref={inputRef} onBlur={() => {
                                    setToggle(!toggle)
                                }} onChange={(e) => {
                                    handleNameChange(todo.id, e)
                                }} className="edit form-control" value={todo.description} type="text" />
                            </div>
                        }
                    </div>
                </div>
            </li>
            <div style={{ height: '0' }}>
                <input ref={imgRef} type="file" onChange={(event) => { uploadPhoto(event) }} className="invisible" accept="image/*" name="photo" id="addPhotoInput" />
            </div>
            <ToastContainer position="bottom-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="dark" />
        </div>

    )
}