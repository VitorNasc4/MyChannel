import { createContext, useContext, useState, useEffect } from "react";
import {api} from "../services/api"

const AuthContext = createContext({})

function AuthProvider({children}) {

    const [data, setData] = useState({})

    
    async function signIn({email, password}) {
        try {
            const response = await api.post("/sessions", {email, password})
            const { user, token } = response.data
            
            localStorage.setItem("@mychannel: user", JSON.stringify(user))
            localStorage.setItem("@mychannel: token", token)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setData({user, token})
            console.log(user)
        }catch (error) {
            if (error.response) {
                alert(error.response.data.message)
            } else {
                alert("Não foi possível entrar")
            }
        }
    }

    function signOut(){
        localStorage.removeItem("@mychannel: token")
        localStorage.removeItem("@mychannel: user")

        setData({})
    }

    async function updateProfile({user}) {
        try {
            await api.put("/user", user)
            
            localStorage.setItem("@mychannel: user", JSON.stringify(user))

           setData({user, token: data.token})

           alert("O perfil foi atualizado")

        }catch (error) {
            if (error.response) {
                alert(error.response.data.message)
            } else {
                alert("Não foi possível atualizar os dados")
            }
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("@mychannel: token")
        const user = localStorage.getItem("@mychannel: user")

        if (token && user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setData({
                token,
                user: JSON.parse(user)
            })
        }
    },[])

    return (
        <AuthContext.Provider value={{
            signIn, 
            signOut,
            updateProfile,
            user: data.user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }