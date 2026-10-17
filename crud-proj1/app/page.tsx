"use client"
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Describes the fields each student record has in the Supabase table.
interface Student {
  id?: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function Home() {
  // Keep the table rows and form values in React state so the page updates when they change.
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({
    name: "",
    email: "",
    phone_number: "",
    gender: "Male",
  });
  // A number means we are editing that student's record; null means we are adding a new one.
  const [editId, setEditId] = useState<number | null>(null);

  // Load the saved students once, after this page first appears in the browser.
  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    // Stop the browser from reloading the page when the form is submitted.
    e.preventDefault();

    // Update the selected record when editing; otherwise, add a new record.
    if (editId) {
      const { error } = await supabase.from("Students").update(form).eq("id", editId);
      if (error) {
        console.error("Error updating student:", error);
        toast.error("Error updating student: " + error.message);
      } else {
        console.log("Student updated successfully");
        toast.success("Student updated successfully");
      }
      setEditId(null); // Leave edit mode after saving.
    } else {
      const { error } = await supabase.from("Students").insert([form]);
      if (error) {
        console.error("Error inserting student:", error);
        toast.error("Error inserting student: " + error.message);
      } else {
        console.log("Student inserted successfully");
        toast.success("Student inserted successfully");
      }
      // Clear the form after adding a student.
      setForm({
        name: "",
        email: "",
        phone_number: "",
        gender: "Male",
      });
    }
    // Reload the table so it reflects the latest database contents.
    fetchStudents();
  }

  // Read all student records from Supabase and put them into state for the table.
  async function fetchStudents() {
    const { data, error } = await supabase.from("Students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students: " + error.message);
    } else {
      console.log("Students fetched successfully:", data);
      setStudents(data || []);
    }
  }

  function handleStudentEdit(student: Student) {
    // Copy this student's values into the form and remember which row to update.
    setForm(student);
    if (student.id) {
      setEditId(student.id);
    }
  }

  async function handleStudentDelete(studentId: number) {
    // Wait for the confirmation dialog; Swal.fire returns a Promise with the user's choice.
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Delete only the row whose id matches the selected student.
      const { error } = await supabase.from("Students").delete().eq("id", studentId);

      if (error) {
        console.error("Error deleting student:", error);
        toast.error("Error deleting student: " + error.message);
      } else {
        console.log("Student deleted successfully");
        toast.success("Student deleted successfully");
        fetchStudents(); // Refresh the table after deleting the record.
      }
    }
  }

  return (
    <>
      <div className="container my-5">
        {/* Toast notifications show success or error messages from database actions. */}
        <Toaster />
        <h3 className="mb-4">Student Management</h3>
        <div className="row">
          {/* The left side contains the add/edit form. */}
          <div className="col-md-4">
            <div className="card md-4">
              <div className="card-body">
                <form onSubmit={ handleFormSubmit }>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="phone" value={form.phone_number} onChange={(e) => setForm({...form, phone_number: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select className="form-select" id="gender" value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    {editId ? "Update Student" : "Add Student" }
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* The right side displays the students currently loaded from Supabase. */}
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.phone_number}</td>
                          <td>{student.gender}</td>
                          <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={ () => handleStudentEdit(student) }>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={ () => student.id && handleStudentDelete(student.id) }>Delete</button>
                          </td>
                        </tr>
                      ))
                    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
