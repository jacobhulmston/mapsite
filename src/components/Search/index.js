
import React, { useState, useEffect, useRef } from 'react'
import CloseButton from "../CloseButton";
import "./style.scss";

export default function Search() {

    const [query, setQuery] = useState('')
    const [users, setUsers] = useState([])
    const focusSearch = useRef(null)

    useEffect(() => { focusSearch.current.focus() }, [])

    // update the url here `YOURURL/search?q=${query}`,
    const getusers = async (query) => {
            const results = await fetch(`https://isj2sncue0.execute-api.eu-west-1.amazonaws.com/CPTestStage/mapsearch?q=${query}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "GET,OPTIONS"
                }
                /*headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                }*/
            })
            const usersData = await results.json()
            return usersData.hits.hit
        
    }


    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    useEffect(() => {
        let currentQuery = true
        const controller = new AbortController()

        const loadusers = async () => {
            if (!query) return setUsers([])

            await sleep(350)
            if (currentQuery) {
                const users = await getusers(query, controller)
                setUsers(users)
            }
        }
        loadusers()

        return () => {
            currentQuery = false
            controller.abort()
        }
    }, [query])

    let usersComponents = users.map((user) => {
        return (
            <li key={user.id}>
                <a href={user.fields.publicURL}><h1>{user.fields.name}</h1></a>
            </li>
        )
    })

    return (
        <div className="search-overlay">

            <div className="search-bar" id="search-bar">
                <input
                    type="email"
                    placeholder="Search..."
                    ref={focusSearch}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                />
            </div>

            <ul className="results">
                {usersComponents}
            </ul>

            <CloseButton />
        </div>
    )
}









