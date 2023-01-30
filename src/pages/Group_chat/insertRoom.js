import React ,{useState} from 'react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';



export default function MakeRoom() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [data, setData] = useState({
      name:'',
  })
  const [photo,setphoto] = useState({
    photo:''
})

  const handleChange = (e) => {
      const name = e.target.name
      const value = e.target.value
      setData({
          ...data, [name]: value
      })

  }

  const makeRoom = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', data.name)
      formData.append('photo', photo)
      axios
      .post( process.env.REACT_APP_BACKEND_USER +`/group`,
        formData,
        {
            headers: {
                "content-type": "multipart/form-data",
                authorization: `Bearer ${token}`
              }
        })
        .then((res)=> {
          console.log('insert group success')
          Swal.fire('Success', 'insert success', 'success');
          navigate('/Home')
        }).catch((err)=> {
          console.log(err.message)
          Swal.fire('Warning',  'error');
        })
  }

  return (
    <div className='container-fluid py-5' style={{backgroundColor:'#fafafa',height:'100vh'}}>
      <div className='bg-white col-10 col-lg-4 offset-lg-4 offset-1 py-5 px-5 ' style={{borderRadius:'30px',marginTop:'60px'}}>
        <h3 className='mb-5 text-center' style={{color:'#7E98DF'}}>Make Room</h3>
        <label for="exampleFormControlInput1" className="form-label text-secondary">Room Name</label>
        <input type="email" className="form-control border-white" id="exampleFormControlInput1" value={data.name} name='name' onChange={handleChange}/>
        <hr/>
        <label for="exampleFormControlInput1" className="form-label text-secondary">Logo/Photo </label>
        <input type="file" className="form-control  border-white" id="exampleFormControlInput1"  name='photo' onChange={((e)=>{setphoto(e.target.files[0])})}/>
        <hr/>
        <button className='btn text-white col-12 mb-2'style={{borderRadius:'30px',backgroundColor:'#7E98DF'}} onClick={makeRoom}>Make Room</button>        
      </div>
    </div>
  )
}
