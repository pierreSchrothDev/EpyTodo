import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import Parser from 'html-react-parser';

import './home.css';

function Home() {
    
    const location = useLocation();
    var userToken = location?.state?.userToken;

    const [userData, setUserData] = useState({});
    const [userTodos, setUserTodos] = useState([]);

    const [newTitle, setTitle] = useState('');
    const [newDescription, setDescription] = useState('');

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    };

    const createTodo = async (event) => {
        await axios.post('http://localhost:4444/todos', {
          title: newTitle,
          description: newDescription,
          due_time: '2021-03-06 19:24:00',
          user_id: userData.id,
          status: 'todo'
        }, {headers: {token: userToken}})
        .then(function (response) {
          if (response.data.msg) {
            window.alert(response.data.msg)
          }
          else {
            window.location.reload(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const deleteTodo = async (id) => {
        await axios.delete('http://localhost:4444/todos/' + id, {headers: {token: userToken}})
        .then(function (response) {
            window.location.reload(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const statusTodo = async (id, title, description, status, user_id) => {
        console.log('reached')
        await axios.put('http://localhost:4444/todos/' + id, {
            title: title,
            description: description,
            due_time: '2021-03-06 19:24:00',
            user_id: user_id,
            status: status
        }, {headers: {token: userToken}})
        .then(function (response) {
            window.location.reload(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    useEffect(() => {
        const loadData = async () => {
            const response = await axios.get("http://localhost:4444/token", {headers: {token: userToken}});
            setUserData(response.data);
            const response2 = await axios.get("http://localhost:4444/" + response.data.id + "/todos", {headers: {token: userToken}});
            setUserTodos(response2.data);
        }
        loadData();
    }, [])
    
    var title = "Here is your stuff ";
    title += userData.firstname;
    title += ' ';
    title += userData.name;

    if (!userToken) {
        return (
            <h1>Plz login</h1>
        )
    }
    
    return (
        <div class="X">
            <h1 class="title" id='h1name'>{Parser(title)}</h1>
            <ul class="SG">
                {userTodos.map((item, index) => (
                    <li key={index} class="sgLi">
                        <div class="box">
                            <div class="flex">
                                <h3>{item.title}</h3>
                                <h3 onClick={() => deleteTodo(item.id)}>X</h3>
                            </div>
                            <p>{item.description}</p>
                            <div class="buttonbox">
                                <button class="button2" onClick={() => statusTodo(item.id, item.title, item.description, 'todo', item.user_id)}>Todo</button>
                                <button class="button2" onClick={() => statusTodo(item.id, item.title, item.description, 'in progress', item.user_id)}>In progress</button>
                                <button class="button2" onClick={() => statusTodo(item.id, item.title, item.description, 'done', item.user_id)}>Done</button>
                            </div>
                            <p>status: {item.status}</p>
                        </div>
                    </li> 
                ))}
            </ul>
            <div class="add">
                <input type="text" placeholder="Title" required="" onChange={handleChangeTitle}/>
                <input type="text" placeholder="Description" required="" onChange={handleChangeDescription}/>
                <button class="button1" onClick={createTodo}>Create new todo</button>
            </div>
        </div>
    );
}

export default Home;