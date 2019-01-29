import React, { useState, useEffect } from "react"
import './App.css';
import './departure-board.css'
import NRCCUAACT from './NRCCUAACT.png'

function NewEmployee({newEmployee, index, completeNewEmployee, removeNewEmployee}) {

  let empStartDate = new Date(newEmployee.startDate)
  var dateMonth = ('0' + (empStartDate.getMonth()+1)).slice(-2)
  var dateDay = ('0' + empStartDate.getDate()).slice(-2)
  var dateString = dateMonth + "." + dateDay
  var letterString = (dateString + " " + newEmployee.location.toUpperCase() + "  " + newEmployee.firstName.toUpperCase() + " " + newEmployee.lastName.toUpperCase()).padEnd(33, ' ')
  var letterArray = letterString.split("")

  var letters = letterArray.map((i, index) => {
    return(<span className='letter' key={index}>{i}</span>)
  })

  return (
    <div className="departure-board" style={{textDecoration: newEmployee.stepsComplete === "True" ? "line-through": "" }}>
      <div>
        {letters}
        <span className="letter"> </span><span className="letter"> </span><span className="letter"> </span>
        <span className="letter" onClick={() => removeNewEmployee(index)}>X</span>
      </div>
    </div>
  )

}

function BlankRow() {
  var blankArray = "".padEnd(37, ' ').split("")
  var blankLetters = blankArray.map((i, index) => {
    return(<span className='letter' key={index}>{i}</span>)
  })

  return (
    <div className="departure-board">
        {blankLetters}
    </div>
  )
}

function LabelRow() {
  return (
    <div className='label-row'>
      <div className='date'>Date</div>
      <div className='location'>Location</div>
      <div className='name'>NAME</div>
    </div>
  )
}

function BottomRow() {
  return(
    <div className="bottom-row">
      <center><img width="200" src={NRCCUAACT} alt="NRCCUA | ACT" /></center>
    </div>
  )
}

function NewEmployeeForm({addNewEmployee}) {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [manager, setManager] = useState("")
  const [location, setLocation] = useState("AUS")

  const handleSubmit = e => {
    e.preventDefault()
    if (!firstName) return
    addNewEmployee(firstName, lastName, startDate, title, department, manager, location)
    setFirstName("")
    setLastName("")
    setStartDate("")
    setTitle("")
    setDepartment("")
    setManager("")
    setLocation("AUS")
  }

  const collapseMenu = () => {
    var menu = document.getElementById('bottom')
    menu.style.visibility = 'hidden'
    var plusSign = document.getElementById('bottom2')
    plusSign.style.visibility = 'visible'
  }


  return (
    <div id="bottom" className="bottom">
    <form onSubmit={handleSubmit}>
      <div className="label" onClick={collapseMenu}>-</div>
      <label className="label">firstname: </label><input
        name="firstName"
        type="text"
        className="input"
        value={firstName}
        onChange={e=> setFirstName(e.target.value)}
      /><br />
      <label className="label">lastname: </label><input
        name="lastName"
        type="text"
        className="input"
        value={lastName}
        onChange={e=> setLastName(e.target.value)}
      /><br />
      <label className="label">start date: </label>
      <input
        name="startDate"
        type="text"
        className="input"
        value={startDate}
        onChange={e=> setStartDate(e.target.value)}
      /><br />
      <label className="label">title: </label>
      <input
        name="title"
        type="text"
        className="input"
        value={title}
        onChange={e=> setTitle(e.target.value)}
      /><br />
      <label className="label">department: </label>
      <input
        name="department"
        type="text"
        className="input"
        value={department}
        onChange={e=> setDepartment(e.target.value)}
      /><br />
      <label className="label">manager: </label>
      <input
        name="manager"
        type="text"
        className="input"
        value={manager}
        onChange={e=> setManager(e.target.value)}
      /><br />
      <label className="label">location: </label>
      <select name="location" value={location} onChange={e=> setLocation(e.target.value)}>
        <option value="AUS">Austin</option>
        <option value="BOS">Boston</option>
        <option value="KC ">Kansas City</option>
        <option value="NY ">New York</option>
        <option value="REM">Remote</option>
      </select>
      <br />
    <button onClick={handleSubmit}>Submit</button>
    </form>
    </div>
  )
}

///this is a comment

function App() {

  const [newEmployees, setNewEmployees] = useState([])
  const [nothing, setNothing] = useState(0)

  useEffect(() => {
    //console.log("USING EFFECT")
    fetch('http://localhost:3005/api')
      .then(response => response.json())
      .then(data => setNewEmployees(data.employees))
    }, [nothing])


  const expandMenu = () => {
    var menu = document.getElementById('bottom')
    menu.style.visibility = 'visible'
    var plusSign = document.getElementById('bottom2')
    plusSign.style.visibility = 'hidden'
  }

  const addNewEmployee = (firstName, lastName, startDate, title, department, manager, location) => {

    var employeeData = {firstName, lastName, startDate, title, department, manager, location, casesCreated: "False", stepsComplete: "False"}
    fetch('http://localhost:3005/api', {
      method: 'POST',
      body: JSON.stringify(employeeData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error))

    //trigger our effect - for some reason gets triggered over and over with setEmployees
    setNothing(nothing + 1)
  }

  const completeNewEmployee = index => {
    const newEmployeeList = [...newEmployees]
    const id = newEmployeeList[index]._id

    var completeData = {id, stepsComplete: "True"}
    fetch('http://localhost:3005/api', {
      method: 'PUT',
      body: JSON.stringify(completeData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error))

    //trigger our effect - for some reason gets triggered over and over with setEmployees
    setNothing(nothing + 1)
  }

  const removeNewEmployee = index => {
    const newEmployeeList = [...newEmployees]
    const id = newEmployeeList[index]._id
    const url = 'http://localhost:3005/api/' + id

    fetch(url, { method: 'DELETE' })
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error))

    setNothing(nothing + 1)
  }

  const createBlankRows = () => {
    let blankRowArray = []
    const numBlanks = 9 - newEmployees.length

    // create array of blank rows
    for (let i = 0; i < numBlanks; i++) {
      blankRowArray.push(<BlankRow />)
    }
    return blankRowArray
  }

  return (
    <div className="app">
      <div className="employee-list">
      <div className="title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NEW EMPLOYEE INFORMATION</div>
      <LabelRow />
        { newEmployees.map((newEmployee, index) => (
          <NewEmployee
            key={index}
            index={index}
            newEmployee={newEmployee}
            completeNewEmployee={completeNewEmployee}
            removeNewEmployee={removeNewEmployee}
          />
        ))}
        {createBlankRows()}
        <BottomRow />
        <div id="bottom2" className="bottom2" onClick={expandMenu}>+</div>
        <NewEmployeeForm addNewEmployee={addNewEmployee} />
      </div>
    </div>
  );
}

export default App;
