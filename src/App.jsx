import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react"

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());
  const inputFocusRef = useRef() 

  useEffect(()=>{
    const fetchUsers = () => {
      if(searchTerm.trim() === ""){
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then(res => res.json())
        .then(res => setUsers(res.users))
        .catch(err => {
          console.log(`Error happened while fetching the user`, err)
        })
            
    }

    fetchUsers();
  }, [searchTerm])

  const handleSelectedUsers = (user) => {
    setSelectedUsers(prev => [...prev, user]);

    // This will prevent the user options to display the suggestions that were already displayed
    setSelectedUsersSet(prev => new Set([...prev, user.email]))
    // Clearing the inpit field amd options
    setSearchTerm("");
    setUsers([]);

    inputFocusRef.current.focus()
  }

  const handleRemoveUserPill = (email) => {
    setSelectedUsers(prev => prev.filter(user => user.email !== email));

    setSelectedUsersSet(prev => {
      const prevUser = prev;
      prevUser.delete(email)
      return new Set(prevUser)
    })
  }

  const handleKeydown = e => {
    if(e.key === "Backspace" && e.target.value === "" && selectedUsers.length > 0){
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUserPill(lastUser.email)
    }
  }

  return (
    <div className="input-search-container">
      <div className="input-search">
        {/* pills */}
        {
          selectedUsers?.map(pill => <div key={pill.email} className="user-pill" onClick={()=>handleRemoveUserPill(pill.email)}>
            <img src={pill.image} alt={`${pill.firstName} ${pill.lastName}`}/>
            <span>{pill.firstName} {pill.lastName} &times;</span>
          </div>)
        }
        <div className="input-search-cont">
          <input 
            type="text" 
            ref={inputFocusRef} 
            placeholder="Search the User..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeydown}
          />
          <ul className="suggestions-list">
            {
              users?.map((user, idx) => 
                !selectedUsersSet.has(user.email) ? <li key={user.email} onClick={()=>{handleSelectedUsers(user)}}>
                  <img src={user.image} alt={`${user.firstName} ${user.lastName}`}/>
                  <span>{user.firstName} {user.lastName}</span>
                </li> : null
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
