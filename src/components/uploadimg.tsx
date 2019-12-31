import React from 'react';
import '../data';
import './uploadimg.css';
import axios from 'axios';

function getContent(file: File | null, loading: number){
  if (file) {
    return (
      <React.Fragment>
        <img className='file-image' src={URL.createObjectURL(file)} />
        <div className='response'>
          <div className="message">{<strong>{file.name}</strong>}</div>
          <progress className="progress" value={loading}></progress>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div key='start' className='start'>
        <div>Select a file or drag here*</div>
          <span className="btn">Select a file</span>
        </div>
      </React.Fragment>
    )
  }
}

interface UploadState {
    file: File | null,
    loading: number,
    isDrag: boolean
}

export default class Upload extends React.Component<{}, UploadState> {
  constructor(props: {}){
    super(props);
    this.state = {
      file: null,
      loading:0,
      isDrag: false
    }
  }

  handleDrag(e: React.DragEvent<HTMLLabelElement>): void{
    e.stopPropagation();
    e.preventDefault();
    if (e.type === 'dragover') {
      this.setState({
        isDrag: true
      });
    } else {
      this.setState({
        isDrag: false
      });
    }
  }
  
  handleChange(e: (React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>)& { dataTransfer: DataTransfer }): void{
    e.stopPropagation();
    e.preventDefault();
    let file: File | null = null;

    if ('files' in e.target && e.target.files) {
        file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files){
        file = e.dataTransfer.files[0];
    }
    if (file === null) return;

    const isGood = (/\/(?=gif|jpg|png|jpeg)/gi).test(file.type);
  
    if (isGood) {
      this.setState({
          file: file,
          isDrag: false
      });
    }
  }

  handleSubmit(e: React.MouseEvent<HTMLInputElement, MouseEvent>): void{
    e.preventDefault();
    //do something
    axios({
      method: 'post',
      url: '/postdata1',
      responseType: 'json',
    })
    .then(
        (response) => {
            this.setState({
              loading:1
            })  
        }
    )
    .catch(
        (error) => {
        }
    );
  }
  render(){
    const content = getContent(this.state.file, this.state.loading);
    return (
      <>
        <h3>React Image Preview & Upload Component</h3>
        <form className='uploader'>
          <input id='file-upload' onChange={(e: React.ChangeEvent<HTMLInputElement> & { dataTransfer: DataTransfer })=> this.handleChange(e)} type='file' accept='image/*'/>
          <label 
            htmlFor='file-upload' 
            className={(this.state.isDrag)?'hover': ''} 
            onDragOver={(e) => this.handleDrag(e)}
            onDragLeave={(e) => this.handleDrag(e)}
            onDrop={(e: React.DragEvent<HTMLLabelElement>) =>{this.handleChange(e)}}
          >
            {content}
          </label>
          <input className='btn-submit' type='submit' value='Submit' onClick={(e) => this.handleSubmit(e)}/>
        </form>
      </>
    );
  };
}
