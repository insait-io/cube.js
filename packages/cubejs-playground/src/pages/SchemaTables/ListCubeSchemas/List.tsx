import { useEffect, useState } from 'react'
import ItemCubeSchema from './Item'
import './style.css'
type Props = {
    listSchemaDB: { [name: string]: string }
}

export default function List({ listSchemaDB }: Props) {
    const [listAlreadyIn, setListAlreadyIn] = useState<CubeSchemas>({})
    const [filteredSchemaDB, setFilteredSchemaDB] = useState<CubeSchemas>({})
    const [isLoadingSchema, setIsLoadingSchema] = useState<boolean>(true)
    const [input, setInput] = useState<string>('')

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lowerCase = event.target.value
        setInput(lowerCase)
    }

    useEffect(() => {
        getListAlreadyIn()
    }, [])

    useEffect(() => {
        const filtered = Object.keys(listSchemaDB).reduce((acc, key) => {
            if (key.toLowerCase().includes(input.toLowerCase())) {
                acc[key] = listSchemaDB[key]
            }
            return acc
        }, {} as CubeSchemas)
        setFilteredSchemaDB(filtered)
    }, [input])

    const getListAlreadyIn = async () => {
        setIsLoadingSchema(true)
        fetch('http://localhost:4001/schema')
            .then((res) => res.json())
            .then((data) => {
                setListAlreadyIn(data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoadingSchema(false)
            })
    }

    return (
        <div>
            {isLoadingSchema ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div className="search">
                        <input
                            id="outlined-basic"
                            onChange={inputHandler}
                            value={input}
                            className="search-input"
                        />
                    </div>
                    <div>
                        {Object.keys(filteredSchemaDB).map(
                            (key: string, index) => {
                                return (
                                    <ItemCubeSchema
                                        key={index}
                                        fileName={key}
                                        name={filteredSchemaDB[key]}
                                        alreadyIn={
                                            listAlreadyIn[key] ? true : false
                                        }
                                    />
                                )
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}