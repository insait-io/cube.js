import React from 'react'
import { CUBE_SERVER_HELPER_URL } from './constants'

type Props = {
    name: string
    fileName: string
    alreadyIn: boolean
}

export default function Item({ name, fileName, alreadyIn }: Props) {
    const [isAlreadyIn, setIsAlreadyIn] = React.useState<boolean>(alreadyIn)

    const onClickCopy = (fileName: string) => {
        fetch(`${CUBE_SERVER_HELPER_URL}/copy/${fileName}`).then((res) => {
            console.log(res)
            if (res.status === 200) {
                setIsAlreadyIn(true)
            }
        })
    }

    const onClickDelete = (fileName: string) => {
        fetch(`${CUBE_SERVER_HELPER_URL}/delete/${fileName}`).then((res) => {
            if (res.status === 200) {
                setIsAlreadyIn(false)
            }
        })
    }

    return (
        <div className="item-container">
            <div>
                {isAlreadyIn ? (
                    <button
                        disabled={!isAlreadyIn}
                        onClick={() => onClickDelete(fileName)}
                    >
                        Delete
                    </button>
                ) : (
                    <div>
                        <button
                            disabled={isAlreadyIn}
                            onClick={() => onClickCopy(fileName)}
                        >
                            Ajouter
                        </button>
                    </div>
                )}
            </div>
            <div style={{ marginLeft: '10px' }}> {name} </div>
        </div>
    )
}