
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, Users, Save } from "lucide-react";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({
    title: "",
    description: "",
    phase: "",
    team: "",
    members: 1,
    start_date: "",
    end_date: "",
    progress: 0,
    status: "Not Started"
  });

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Format the dates to YYYY-MM-DD for the input
        const formattedStartDate = data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '';
        const formattedEndDate = data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '';
        
        setProject({
          ...data,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          members: data.members || 1
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get user ID from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create or edit projects");
      }
      
      const userId = session.user.id;
      
      // Prepare data
      const projectData = {
        ...project,
        user_id: userId,
        progress: parseInt(String(project.progress)),
        members: parseInt(String(project.members)),
      };
      
      if (isEditing) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        // Insert new project
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      
      // Navigate back to projects page
      navigate("/projects");
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Project' : 'Create Project'}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Project Details' : 'New Project'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your project information below' 
              : 'Fill in the details to create a new project'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                name="title" 
                value={project.title} 
                onChange={handleChange} 
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={project.description || ''} 
                onChange={handleChange} 
                placeholder="Describe your project"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase">Phase</Label>
                <Input 
                  id="phase" 
                  name="phase" 
                  value={project.phase || ''} 
                  onChange={handleChange} 
                  placeholder="e.g. Planning, Development"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={project.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team</Label>
                <Input 
                  id="team" 
                  name="team" 
                  value={project.team || ''} 
                  onChange={handleChange} 
                  placeholder="Team name or department"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="members">Team Members</Label>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="members" 
                    name="members" 
                    type="number" 
                    min="1"
                    value={project.members} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="start_date" 
                    name="start_date" 
                    type="date" 
                    value={project.start_date || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="end_date" 
                    name="end_date" 
                    type="date" 
                    value={project.end_date || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="progress">Progress ({project.progress}%)</Label>
              <Input 
                id="progress" 
                name="progress" 
                type="range" 
                min="0" 
                max="100" 
                value={project.progress} 
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Project'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
