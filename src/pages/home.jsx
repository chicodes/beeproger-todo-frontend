import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { ToastContainer, toast } from 'react-toastify';
const Paginator = lazy(() => import('../components/Pagination'))
const SideBar = lazy(() => import('../components/SideBar'))
const TodoTile = lazy(() => import('../components/TodoTile'))

export default function Home() {
    let [todoList, updateTodoList] = useState([])
    let [preloader, setPreloader] = useState(false)
    let [page, setPage] = useState(1)

    useEffect(() => {
        fetchTodo()
    }, [])

    async function fetchTodo(page = 1) {
        console.log(process.env.REACT_APP_BASE_URL)
        try {
            setPreloader(true)
            let response = await axios.get(`${process.env.REACT_APP_BASE_URL}?page=${page}`)
            let fetchedData = response?.data.data.data
            let reverse = fetchedData.reverse()
            setPage(response?.data.data.last_page)
            // eslint-disable-next-line
            updateTodoList(reverse?.map((item) => {
                if (item.status === 'PENDING') {
                    return { ...item, active: false, complete: false }
                }
                else if (item.status === 'COMPLETE') {
                    return { ...item, active: false, complete: true }
                }
            }))
            setPreloader(false)
        }
        catch (error) {
            console.log(error)
            setPreloader(false)
            updateTodoList([])
        }
    }

    async function removeTask(task, i) {
        updateTodoList(todoList.splice(i, 1))
        if (task.image_link !== '') {
            try {
                let response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/delete/${task.id}`)
                console.log(response.data.status)
                if (response.data.status === true) {
                    notification('Todo deleted.')
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        else {
            notification('Todo deleted.')
        }
    }

    function addTodo() {
        const date = new Date()
        let today = date.toISOString()
        const id = todoList.length + 1;

        let temp = {
            id: id,
            description: 'New todo',
            status: 'PENDING',
            image_link: '',
            complete: false,
            active: false,
            photo: '',
            start_date: today,
            end_date: today
        }

        updateTodoList((prev) => [
            temp,
            ...prev
        ]);
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

    function updateName(item, e) {
        updateTodoList(todoList?.map(list => {
            if (list.id === item) {
                return { ...list, description: e };
            }
            else {
                return list
            }
        }))
    }
    function attachImage(item, e) {
        updateTodoList(todoList?.map(list => {
            if (list.id === item) {
                return { ...list, photo: e };
            }
            else {
                return list
            }
        }))
    }


    async function uploadToCloud(todo) {
        let formData = new FormData()
        let start = todo.start_date.split('T')[0]
        let end = todo.end_date.split('T')[0]
        formData.append('todoPhoto', todo.photo)
        formData.append('description', todo.description)
        formData.append('status', todo.status)
        formData.append('startDate', start)
        formData.append('endDate', end)
        if (todo.created_at) {

            if (todo.photo === undefined) {
                try {
                    let response = await axios.post(`${process.env.REACT_APP_BASE_URL}/updateTodo/${todo.id}`, formData)
                    if (response.data.status) {
                        notification('Todo updated.')
                        // fetchTodo()
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
            else {

                if (todo.photo && todo.photo !== undefined) {
                    try {
                        let response = await axios.post(`${process.env.REACT_APP_BASE_URL}/updateTodo${todo.id}`, formData)
                        if (response.data.status) {
                            notification('Todo updated.')
                            // fetchTodo()
                        }
                    }
                    catch (error) {
                        notification('Unable to update todo')
                    }
                }
                else {
                    notification('Please select a picture to save todo.')
                }

            }
        }
        else {
            if (todo.photo) {
                try {
                    let response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addTodo`, formData)

                    if (response.data.status) {
                        fetchTodo()
                        notification('Todo added.')
                    }
                }
                catch (error) {
                    notification('Unable to add todo')
                }
            }
            else {
                notification('Please select a picture to save todo.')
            }
        }
    }

    function changeToActive(item) {
        updateTodoList(todoList?.map(list => {
            if (list.id !== item) {
                return { ...list, active: false, };
            } else {
                return { ...list, active: true };
            }
        }));
    }

    function changeSpecific(item, e) {
        updateTodoList(todoList?.map(list => {
            // eslint-disable-next-line
            if (list.id === item) {
                if (list.id === item && e === true) {
                    try {
                        let response = axios.patch(`${process.env.REACT_APP_BASE_URL}/status/${list.id}`, { status: 'COMPLETE' })
                        if (response) {
                            notification('Todo updated.')
                        }
                        return { ...list, complete: e, status: 'COMPLETE' };
                    }
                    catch (error) {
                        notification('Unable to change status')
                    }
                }

                else {
                    try {
                        let response = axios.patch(`${process.env.REACT_APP_BASE_URL}/status/${list.id}`, { status: 'PENDING' })
                        if (response) {
                            notification('Todo updated.')
                        }
                        return { ...list, complete: e, status: 'PENDING' }
                    }
                    catch {
                        notification('Unable to change status')
                    }
                }
            }
            else {
                return list
            }
        }));
    }

    function changeAllToActive(e) {
        updateTodoList(todoList?.map(list => {
            if (list.complete === false && e.target.checked) {
                return { ...list, complete: e.target.checked, };
            }
            else {
                return { ...list, complete: e.target.checked };
            }
        }))
    }


    const todoArray = todoList?.map((item, i) => {
        return (
            <div onClick={() => {
                changeToActive(item.id)
            }} >
                <TodoTile changeSpecific={changeSpecific} removeTask={() => { removeTask(item, i) }} attachImage={attachImage} todo={item} active={item.active} updateName={updateName} key={item.id} uploadToCloud={uploadToCloud} />
            </div>
        )
    })

    return (
        <section className="hbox stretch mt-5">
            {
                <SideBar /> && <Suspense>
                    <SideBar />
                </Suspense>
            }
            <section id="content">
                <section className="hbox stretch" id="taskapp">
                    <aside>
                        <section className="vbox">
                            <header className="header bg-light lter bg-gradient b-b">
                                <button onClick={addTodo} className="btn btn-success btn-sm pull-right btn-icon" id="new-task"><i className="fa fa-plus"></i></button>
                                <p>Tasks</p>
                            </header>
                            <section className="bg-light lter">
                                <section className="hbox stretch">

                                    <aside className="col-lg-4 bg-white">
                                        <section className="vbox">
                                            <section className="scrollable wrapper">
                                                <ul id="task-comment" className="list-group list-group-sp">
                                                    <div>
                                                        {
                                                            preloader ? <Loader /> : <Suspense>
                                                                {todoArray.length > 0 ? todoArray : <h1 className='p-5'>No todos to display.</h1>}
                                                            </Suspense>
                                                        }
                                                    </div>
                                                </ul>
                                            </section>
                                        </section>
                                    </aside>

                                </section>
                            </section>
                            <footer className="footer bg-white-only b-t">
                                <p className="checkbox"><label><input onChange={(event) => changeAllToActive(event)} id="toggle-all" type="checkbox" /> Mark all as complete</label></p>
                                <div className="text-center">

                                    {
                                        <Paginator /> && <Suspense>
                                            <Paginator changePage={fetchTodo} pages={page} />
                                        </Suspense>
                                    }
                                </div>
                            </footer>

                        </section>
                    </aside>

                    <aside className="col-lg-4 bg-white">
                        <section className="vbox flex b-l" id="task-detail">
                        </section>
                    </aside>



                </section>
            </section>

            <div className='hidden'>
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
        </section>


    )
}
