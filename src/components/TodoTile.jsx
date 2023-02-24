import React from 'react';
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Icon from "../images/avatar.png"
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

    function handleNameChange(item, e) {
        updateName(item, e.target.value)
    }
    var pic = null
    const uploadPhoto = async (event) => {
        pic = event.target.files[0]
        let base64 = await Base64URL(pic)
        if(pic){
            notification('Uploaded.')
        }
        setPicture(base64)
        attachImage(todo.id, pic)
    }
    function triggerUpload() {
        imgRef.current.click()
    }
    function send() {
        uploadToCloud(todo) 
    }
    return (
        <div>
            <li className={active ? 'list-group-item hover active' : 'list-group-item hover'}>
                <small className="text-muted pull-right"> {fromIsoToDateString(todo?.start_date)} - {fromIsoToDateString(todo?.end_date)}</small>
                <small className="text-muted pull-right"></small>
                <span onClick={triggerUpload} className="height" >
                    <img height="20" length="20" src={todo.image_link ? todo.image_link : temp_picture || Icon} alt="Todo" />
                </span>
                <span onClick={send} className="touch ml-2"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M6.75 3h-1A2.75 2.75 0 0 0 3 5.75v12.5A2.75 2.75 0 0 0 5.75 21H6v-6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 15v6h.25A2.75 2.75 0 0 0 21 18.25V8.286a3.25 3.25 0 0 0-.952-2.299l-2.035-2.035A3.25 3.25 0 0 0 15.75 3v4.5a2.25 2.25 0 0 1-2.25 2.25H9A2.25 2.25 0 0 1 6.75 7.5V3Zm7.5 0v4.5a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V3h6Zm2.25 18v-6a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v6h9Z"/></svg></span>
                <span onClick={changePage} className="touch ml-2"><i className="fa fa-eye"></i></span>
                <div className="view" id="task-3">
                    <button onClick={removeTask} className="destroy close hover-action">×</button>
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