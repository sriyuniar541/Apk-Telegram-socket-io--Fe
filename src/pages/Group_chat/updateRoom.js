import React ,{useState, useEffect} from 'react'
import axios from 'axios';
import { Link, useNavigate, useParams} from "react-router-dom";
import Swal from 'sweetalert2';



export default function UpdateRoom() {
  const rooms = JSON.parse(localStorage.getItem('group')).name
  const {id} = useParams()
  console.log(id,'ini id')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [data, setData] = useState({
      name:rooms,
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


// //get grups
// const grupChat = () => {
//   axios.get( process.env.REACT_APP_BACKEND_USER +`/groups/${id}`,
//     {
//       headers: {
//         "content-type": "multipart/form-data",
//         authorization: `Bearer ${token}`
//       }
//     })
//     .then((res) => {
//       setData(res.data.data[0])
//       console.log(data, 'ini data grup')
//       // alert('success')
//     }).catch((err) => {
//       console.log(err.message)
//       alert(err.message)
//     })
// }

// useEffect(() => {
//   grupChat()
// }, [])




  //update
  const updateRoom = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', data.name)
      formData.append('photo', photo)
// .post( process.env.REACT_APP_BACKEND_USER +`/group`
      axios.put( process.env.REACT_APP_BACKEND_USER +`/group/${id}`,
        formData,
        {
            headers: {
                "content-type": "multipart/form-data",
                authorization: `Bearer ${token}`
              }
        })
        .then((res)=> {
          console.log('update success')
          Swal.fire('Success', 'update success', 'success');
          navigate('/Home')
        }).catch((err)=> {
          console.log(err.message)
          Swal.fire('Warning',  'error');
        })
  }

  return (
    <div className='container-fluid py-5' style={{backgroundColor:' #fafafa',height:'100vh'}}>
      <div className='bg-white col-10 col-lg-4 offset-lg-4 offset-1 py-5 px-5 ' style={{borderRadius:'30px',marginTop:'60px'}}>
        <h3 className='mb-5 text-center' style={{color:'#7E98DF'}}>Update Room</h3>
        <label for="exampleFormControlInput1" className="form-label text-secondary">Room Name</label>
        <input type="email" className="form-control border-white" id="exampleFormControlInput1" value={data.name} name='name' onChange={handleChange}/>
        <hr/>
        <label for="exampleFormControlInput1" className="form-label text-secondary">Logo/Photo </label>
        <input type="file" className="form-control  border-white" id="exampleFormControlInput1"  name='photo' onChange={((e)=>{setphoto(e.target.files[0])})}/>
        <hr/>
        <button className='btn text-white col-12 mb-2'style={{borderRadius:'30px',backgroundColor:'#7E98DF'}} onClick={updateRoom}>Update Room</button>
      </div>
    </div>
  )
}
