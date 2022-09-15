import React, { useEffect, useState } from 'react'
import { CUBE_SERVER_HELPER_URL } from './constants'
import List from './List'

type Props = {}

export default function ListCubeSchemas({}: Props) {
    const [listSchemaDB, setListSchemaDB] = useState<CubeSchemas>({})
    const [isLoadingSchemaDB, setIsLoadingSchemaDB] = useState<boolean>(true)

    useEffect(() => {
        getListSchemaDB()
    }, [])

    const getListSchemaDB = () => {
        setIsLoadingSchemaDB(true)
        fetch(`${CUBE_SERVER_HELPER_URL}/schemaDB`)
            .then((res) => res.json())
            .then((data) => {
                setListSchemaDB(data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoadingSchemaDB(false)
            })
    }
    return (
        <div>
            <h1>Search Table:</h1>

            {!isLoadingSchemaDB && <List listSchemaDB={listSchemaDB} />}
        </div>
    )
}