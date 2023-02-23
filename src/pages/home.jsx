import React from 'react';
import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import Loader from "../components/Loader";
const Paginator = lazy(() => import('../components/Pagination'))
const SideBar = lazy(() => import('../components/SideBar'))
const TodoTile = lazy(() => import('../components/TodoTile'))

export default function Home() {
    let [todoList, updateArray] = useState([])
    let [preloader, setPreloader] = useState(false)
    
    useEffect(() => {
        fetchTodo()
    }, [])

    async function fetchTodo(page = 1) {
        try {
            setPreloader(true)
            let response = await axios.get(`http://todo-test.herokuapp.com/todo/v1?page=${page}`)
            let fetchedData = response?.data.data.data
            // eslint-disable-next-line
            updateArray(fetchedData?.map((item) => {
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
            updateArray([])
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

        updateArray((prev) => [
            ...prev,
            temp
        ]);
    }

    function updateName(item, e) {
        updateArray(todoList?.map(list => {
            if (list.id === item) {
                return { ...list, description: e };
            }
            else {
                return list
            }
        }))
    }
    function attachImage(item, e) {
        updateArray(todoList?.map(list => {
            if (list.id === item) {
                return { ...list, photo: e };
            }
            else {
                return list
            }
        }))
    }
    function uploadToCloud(todo) {
        const today = new Date()
        let tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        let formData = new FormData()
        formData.append('todoPhoto', todo.photo)
        formData.append('description', todo.description)
        formData.append('status', todo.status)
        formData.append('startDate', todo.start_date)
        formData.append('endDate', todo.end_date)
        if (!todo.created_at) {
            let response = axios.post(`https://todo-test.herokuapp.com/todo/v1/addTodo`, formData)
            if(response.status){
                fetchTodo()
            }
        }
        else {
            let response = axios.post(`https://todo-test.herokuapp.com/todo/v1/updateTodo/${todo.id}`, formData)
            if(response.status){
                fetchTodo()
            }
        }
    }

    function changeToActive(item) {
        updateArray(todoList?.map(list => {
            if (list.id !== item) {
                return { ...list, active: false, };
            } else {
                return { ...list, active: true };
            }
        }));
    }

    function changeSpecific(item, e) {
        let unique = item
        updateArray(todoList?.map(list => {
            if (list.id === unique && e) {
                let response = axios.patch(`https://todo-test.herokuapp.com/todo/v1/status/${list.id}`, { status: 'COMPLETE' })
                return { ...list, complete: e, status: 'COMPLETE' };
            }
            else {
                let response = axios.patch(`https://todo-test.herokuapp.com/todo/v1/status/${list.id}`, { status: 'PENDING' })
                return { ...list, complete: e, status: 'PENDING' };
            }
        }));
    }

    function changeAllToActive(e) {
        updateArray(todoList?.map(list => {
            if (list.complete === false && e.target.checked) {
                return { ...list, complete: e.target.checked, };
            }
            else {
                return { ...list, complete: e.target.checked };
            }
        }))
    }

    function removeTask(item) {
        let newAraray = [...todoList]
        updateArray(newAraray?.filter(list => item !== list.id))
        let response = axios.delete(`https://todo-test.herokuapp.com/todo/v1/delete/${item}`)
        console.log(response)
    }

    const todoArray = todoList?.map((item, i) => {
        return (
            <div onClick={() => {
                changeToActive(item.id)
            }} >
                <TodoTile changeSpecific={changeSpecific} removeTask={removeTask} attachImage={attachImage} todo={item} active={item.active} updateName={updateName} key={item.id} uploadToCloud={uploadToCloud} />
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
                                                            !preloader && <Suspense fallback={<Loader />}>
                                                                {todoArray}
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
                                            <Paginator changePage={fetchTodo} />
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

        </section>


    )
}