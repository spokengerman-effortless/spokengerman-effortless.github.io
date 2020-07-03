////////////////////////////////////////////////////////////////////////

class Recorder
{
	constructor(num, recorder_time = 5000.0)
	{
		this.recorder_num = -1;
		this.recorder_obj = null;
		this.recorder_data = [];
		this.recorder_time = recorder_time;
		this.recorder_words = new Array(num);

		this.recorder_func = (stream, that) => {
			that.recorder_obj = new MediaRecorder(stream);
			that.recorder_obj.addEventListener(
				"dataavailable",
				event => {
					that.recorder_data.push(event.data);
				}
			);
			that.recorder_obj.addEventListener(
				"start",
				() => {
					that.recorder_data = [];
				}
			);
			that.recorder_obj.addEventListener(
				"stop",
				() => {
					const blob = new Blob(that.recorder_data);
					const aurl = URL.createObjectURL(blob);
					that.recorder_words[that.recorder_num] = new Audio(aurl);
					that.recorder_words[that.recorder_num].volume = 1.0;
					that.recorder_words[that.recorder_num].play();
				}
			);
			that.recorder_obj.start();
			that.recorder_obj.stop();
		}
		this.stream_func = (stream) => { this.recorder_func(stream, this); }

		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		{
			navigator
				.mediaDevices
				.getUserMedia({audio: true, video: false})
				.then(this.stream_func)
				.catch(function (e) { alert(e.name + ": " + e.message); })
				;
		}
		else
		{
			navigator.getAudio = (
				navigator.getUserMedia ||
				navigator.webKitGetUserMedia ||
				navigator.moxGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia
			);
			if (navigator.getAudio)
			{
				navigator.getAudio(
					{audio: true, video: false},
					this.stream_func,
					function () { alert("Audio is not accessible."); }
				);
			}
		};
	}

	button(idname, enable_btn = true, image_btn = 0)
	{
		$("#" + idname + "-recbtn").prop("disabled", !enable_btn);
		$("#" + idname + "-playbtn").prop("disabled", !enable_btn);
		if (image_btn  == 0) $("#" + idname + "-mic"   ).show(); else $("#" + idname + "-mic"   ).hide();
		if (image_btn  == 1) $("#" + idname + "-speaka").show(); else $("#" + idname + "-speaka").hide();
		if (image_btn  == 2) $("#" + idname + "-speakb").show(); else $("#" + idname + "-speakb").hide();
		if (image_btn  == 3) $("#" + idname + "-speakc").show(); else $("#" + idname + "-speakc").hide();
		if (image_btn  == 4) $("#" + idname + "-speakd").show(); else $("#" + idname + "-speakd").hide();
		if (image_btn  == 5) $("#" + idname + "-loud"  ).show(); else $("#" + idname + "-loud"  ).hide();
	}

	record(num, idname)
	{
		if (this.recorder_num < 0)
		{
			var relem = $("#noveco-reclen");
			if (relem)
			{
				this.recorder_time = Number(relem.text())*1000.0;
			}
			this.recorder_num = num;
			this.recorder_obj.start();
			setTimeout(() => { this.recorder_obj.stop(); }, 1.0*this.recorder_time);
			setTimeout(() => { this.recorder_num = -1;   }, 2.1*this.recorder_time);
			if (idname)
			{
				/****************/ this.button(idname, false, 1);      // 0.0
				/****************/ $('#' + idname + '-playbtn').hide() // 0.0
				setTimeout(() => { this.button(idname, false, 2);      }, 0.2*this.recorder_time);
				setTimeout(() => { this.button(idname, false, 3);      }, 0.4*this.recorder_time);
				setTimeout(() => { this.button(idname, false, 4);      }, 0.6*this.recorder_time);
				setTimeout(() => { this.button(idname, false, 5);      }, 1.0*this.recorder_time);
				setTimeout(() => { this.button(idname, true,  0);      }, 2.0*this.recorder_time);
				setTimeout(() => { $('#' + idname + '-playbtn').show() }, 2.1*this.recorder_time);
			}
		}
	}

	play(num, idname)
	{
		if (this.recorder_num < 0)
		{
			var relem = $("#noveco-reclen");
			if (relem)
			{
				this.recorder_time = Number(relem.text())*1000.0;
			}
			this.recorder_num = num;
			this.recorder_words[num].volume = 1.0;
			this.recorder_words[num].play();
			setTimeout(() => { this.recorder_num = -1; }, 1.1*this.recorder_time);
			if (idname)
			{
				/****************/ this.button(idname, false, 5);         // 0.0
				/****************/ $('#' + idname + '-playbtn').hide()    // 0.0
				setTimeout(() => { this.button(idname, true , 0); },      1.0*this.recorder_time);
				setTimeout(() => { $('#' + idname + '-playbtn').show() }, 1.1*this.recorder_time);
			}
		}
	}
};

////////////////////////////////////////////////////////////////////////
